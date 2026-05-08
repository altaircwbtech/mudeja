"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadPhotoAction(formData: FormData, providerId: string, currentCount: number) {
  const file = formData.get("photo") as File;
  const caption = formData.get("caption") as string;
  const supabase = await createClient();
  
  if (!file || file.size === 0) {
    return { success: false, error: "Arquivo não selecionado" };
  }

  const fileName = `${providerId}/${Date.now()}_${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("trabalhos")
    .upload(fileName, file);
  
  if (uploadError) {
    console.error("Storage error:", uploadError);
    return { success: false, error: uploadError.message };
  }

  const { data: { publicUrl } } = supabase.storage.from("trabalhos").getPublicUrl(fileName);
  
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
    console.error("DB error:", dbError);
    return { success: false, error: dbError.message };
  }

  revalidatePath("/prestador/perfil/fotos");
  revalidatePath("/prestador");
  return { success: true, photo };
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
