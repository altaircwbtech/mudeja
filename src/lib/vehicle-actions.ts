"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addVehicle(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { data: providerData } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!providerData) {
    throw new Error("Perfil de prestador não encontrado");
  }

  const vehicleType = formData.get("vehicle_type") as string;
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;
  const yearStr = formData.get("year") as string;
  const plate = formData.get("plate") as string;
  const capacityKgStr = formData.get("capacity_kg") as string;

  if (!vehicleType || !brand || !model || !plate) {
    throw new Error("Preencha os campos obrigatórios");
  }

  const { error } = await supabase.from("provider_vehicles").insert({
    provider_id: providerData.id,
    vehicle_type: vehicleType,
    brand,
    model,
    year: yearStr ? parseInt(yearStr) : null,
    plate: plate.toUpperCase(),
    capacity_kg: capacityKgStr ? parseInt(capacityKgStr) : null,
  });

  if (error) {
    throw new Error(`Erro ao cadastrar veículo: ${error.message}`);
  }

  revalidatePath("/prestador/perfil/veiculos");
  revalidatePath("/prestador");

  return { success: true };
}

export async function deleteVehicle(vehicleId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const { error } = await supabase
    .from("provider_vehicles")
    .delete()
    .eq("id", vehicleId);

  if (error) {
    throw new Error(`Erro ao remover veículo: ${error.message}`);
  }

  revalidatePath("/prestador/perfil/veiculos");
  revalidatePath("/prestador");

  return { success: true };
}
