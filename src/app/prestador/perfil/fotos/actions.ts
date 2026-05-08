"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadPhotoAction(formData: FormData, providerId: string, currentCount: number) {
  try {
    const file = formData.get("photo") as File;
    const caption = formData.get("caption") as string;
    const supabase = await createClient();
    
    console.log("🚀 Iniciando upload para o prestador:", providerId);
    console.log("📁 Arquivo:", file?.name, "Tamanho:", file?.size);

    if (!file || file.size === 0) {
      console.error("❌ Arquivo vazio ou não selecionado");
      return { success: false, error: "Arquivo não selecionado ou vazio" };
    }

    const fileName = `${providerId}/${Date.now()}_${file.name}`;
    console.log("⬆️ Enviando para o bucket 'trabalhos'...");
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("trabalhos")
      .upload(fileName, file);
    
    if (uploadError) {
      console.error("❌ Erro no Storage:", uploadError);
      return { success: false, error: `Erro no Storage: ${uploadError.message}` };
    }

    console.log("✅ Upload concluído. Gerando URL pública...");
    const { data: { publicUrl } } = supabase.storage.from("trabalhos").getPublicUrl(fileName);
    
    console.log("📝 Salvando no banco de dados...");
    const { data: photo, error: dbError } = await supabase
      .from("provider_photos")
      .insert({
        provider_id: providerId,
        url: publicUrl,
        caption: caption || "",
        sort_order: currentCount + 1
      })
      .select()
      .single();

    if (dbError) {
      console.error("❌ Erro no Banco:", dbError);
      return { success: false, error: `Erro no Banco: ${dbError.message}` };
    }

    console.log("🎉 Tudo pronto!");
    revalidatePath("/prestador/perfil/fotos");
    revalidatePath("/prestador");
    return { success: true, photo };
  } catch (err: any) {
    console.error("💥 Erro fatal na Action:", err);
    return { success: false, error: err.message || "Erro interno no servidor" };
  }
}

export async function removePhotoAction(id: string, url: string) {
  const supabase = await createClient();
  
  // Extract path from public URL
  const path = url.split("/trabalhos/")[1];
  if (path) {
    await supabase.storage.from("trabalhos").remove([path]);
  }
  
  const { error } = await supabase.from("provider_photos").delete().eq("id", id);
  
  if (error) return false;

  revalidatePath("/prestador/perfil/fotos");
  revalidatePath("/prestador");
  return true;
}
