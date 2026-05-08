"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addVehicle(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado" };

  const providerId = formData.get("provider_id") as string;
  const vehicleType = formData.get("vehicle_type") as string;
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const year = formData.get("year") ? parseInt(formData.get("year") as string) : null;
  const plate = formData.get("plate") as string;
  const photo = formData.get("photo") as File;

  let photoUrl = null;

  // Handle Photo Upload
  if (photo && photo.size > 0) {
    const fileExt = photo.name.split(".").pop();
    const fileName = `${providerId}-${Math.random()}.${fileExt}`;
    const filePath = `vehicles/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("vehicles")
      .upload(filePath, photo);

    if (uploadError) {
      console.error("Error uploading vehicle photo:", uploadError);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from("vehicles")
        .getPublicUrl(filePath);
      photoUrl = publicUrl;
    }
  }

  const { error } = await supabase.from("provider_vehicles").insert({
    provider_id: providerId,
    vehicle_type: vehicleType,
    brand,
    model,
    year,
    plate,
    photo_url: photoUrl,
    is_primary: true, // For now, let's make it primary
  });

  if (error) {
    console.error("Error adding vehicle:", error);
    return { error: "Erro ao adicionar veículo no banco de dados." };
  }

  revalidatePath("/prestador/veiculos");
  revalidatePath("/explorar");
  return { success: true };
}

export async function deleteVehicle(vehicleId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado" };

  const { error } = await supabase
    .from("provider_vehicles")
    .delete()
    .eq("id", vehicleId);

  if (error) {
    console.error("Error deleting vehicle:", error);
    return { error: "Erro ao excluir veículo." };
  }

  revalidatePath("/prestador/veiculos");
  revalidatePath("/explorar");
  return { success: true };
}
