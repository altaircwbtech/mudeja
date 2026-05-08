'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfileAvatar(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Não autenticado" };

  const file = formData.get("avatar") as File;
  if (!file) return { success: false, error: "Nenhum arquivo enviado" };

  try {
    // 1. Upload to Supabase Storage (bucket 'avatars')
    const fileName = `${user.id}/${Date.now()}-${file.name}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error("Erro no upload do avatar:", uploadError);
      return { success: false, error: `Erro no Storage: ${uploadError.message}` };
    }

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    // 3. Update users table
    const { error: updateError } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) throw updateError;

    revalidatePath("/prestador");
    revalidatePath("/prestador/perfil");
    
    return { success: true, avatar_url: publicUrl };
  } catch (error: any) {
    console.error("Erro ao atualizar avatar:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProfileData(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Não autenticado" };

  const fullName = formData.get("fullName") as string;
  const businessName = formData.get("businessName") as string;
  const bio = formData.get("bio") as string;
  const phone = formData.get("phone") as string;

  try {
    // Update users table
    const { error: userError } = await supabase
      .from("users")
      .update({ 
        full_name: fullName,
        phone: phone
      })
      .eq("id", user.id);

    if (userError) throw userError;

    // Update providers table
    const { error: providerError } = await supabase
      .from("providers")
      .update({ 
        business_name: businessName,
        bio: bio
      })
      .eq("user_id", user.id);

    if (providerError) throw providerError;

    revalidatePath("/prestador");
    revalidatePath("/prestador/perfil");
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao atualizar dados:", error);
    return { success: false, error: error.message };
  }
}

export async function addWorkPhoto(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado" };

  const providerId = formData.get("provider_id") as string;
  const photo = formData.get("photo") as File;

  if (!photo || photo.size === 0) return { error: "Nenhuma foto enviada" };

  const fileExt = photo.name.split(".").pop();
  const fileName = `${providerId}-${Math.random()}.${fileExt}`;
  const filePath = `work-photos/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("provider-photos")
    .upload(filePath, photo);

  if (uploadError) {
    console.error("Error uploading work photo:", uploadError);
    return { error: "Erro ao subir imagem para o servidor" };
  }

  const { data: { publicUrl } } = supabase.storage
    .from("provider-photos")
    .getPublicUrl(filePath);

  // Insert into database
  const { data: photoData, error: dbError } = await supabase
    .from("provider_photos")
    .insert({
      provider_id: providerId,
      url: publicUrl,
    })
    .select()
    .single();

  if (dbError) {
    console.error("Error saving work photo to DB:", dbError);
    return { error: "Erro ao salvar referência da foto no banco" };
  }

  revalidatePath("/prestador/perfil");
  revalidatePath("/explorar");
  return { success: true, photo: photoData };
}

export async function deleteWorkPhoto(photoId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("provider_photos")
    .delete()
    .eq("id", photoId);

  if (error) {
    console.error("Error deleting work photo:", error);
    return { error: "Erro ao remover foto do banco" };
  }

  revalidatePath("/prestador/perfil");
  revalidatePath("/explorar");
  return { success: true };
}
