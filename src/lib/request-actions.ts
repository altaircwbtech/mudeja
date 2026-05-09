"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuário não autenticado." };
  }

  const service_type = formData.get("service_type") as string;
  const move_size = formData.get("move_size") as string;
  const description = formData.get("description") as string;

  // Title generation logic
  let typeLabel = "Mudança";
  if (service_type === "carreto") typeLabel = "Carreto";
  if (service_type === "frete_pequeno") typeLabel = "Frete";
  
  const title = `${typeLabel} de ${formData.get("origin_neighborhood")} para ${formData.get("dest_neighborhood")}`;

  const payload = {
    user_id: user.id,
    title,
    service_type,
    move_size: move_size || null,
    status: "published",
    
    origin_address: `${formData.get("origin_neighborhood")}, ${formData.get("origin_city")} - ${formData.get("origin_state")}`,
    origin_city: formData.get("origin_city"),
    origin_state: formData.get("origin_state"),
    origin_neighborhood: formData.get("origin_neighborhood"),
    origin_has_elevator: formData.get("origin_has_elevator") === "true",
    origin_floor: parseInt(formData.get("origin_floor") as string) || 0,
    origin_residence_type: formData.get("origin_residence_type") || "casa",

    destination_address: `${formData.get("dest_neighborhood") || ""}, ${formData.get("dest_city") || ""} - ${formData.get("dest_state") || ""}`,
    destination_city: formData.get("dest_city"),
    destination_state: formData.get("dest_state"),
    destination_neighborhood: formData.get("dest_neighborhood"),
    destination_has_elevator: formData.get("dest_has_elevator") === "true",
    destination_floor: parseInt(formData.get("dest_floor") as string) || 0,
    destination_residence_type: formData.get("dest_residence_type") || "casa",
    
    preferred_date: formData.get("desired_date") || null,
    flexible_date: formData.get("is_date_flexible") === "true",
    
    needs_packing: formData.get("needs_packing") === "true",
    needs_disassembly: formData.get("needs_assembly") === "true",
    needs_helper: formData.get("needs_helper") === "true",

    client_has_helpers: formData.get("client_has_helpers") === "true",
    client_helpers_count: parseInt(formData.get("client_helpers_count") as string) || 0,
    
    description,
  };

  console.log("Creating request with payload:", JSON.stringify(payload, null, 2));

  const { data: requestData, error } = await supabase
    .from("service_requests")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("Supabase Error creating request:", error);
    return { error: `Erro ao criar solicitação: ${error.message}` };
  }

  // Insert inventory items if provided
  const itemsJson = formData.get("items") as string;
  if (itemsJson) {
    try {
      const items = JSON.parse(itemsJson);
      if (Array.isArray(items) && items.length > 0) {
        const { error: itemsError } = await supabase.from("request_items").insert(
          items.map((item: any) => ({
            request_id: requestData.id,
            name: item.name,
            quantity: item.quantity || 1,
            needs_disassembly: item.needs_disassembly || false,
            is_fragile: item.is_fragile || false,
            notes: item.notes || null,
          }))
        );
        if (itemsError) console.error("Error inserting items:", itemsError);
      }
    } catch (parseError) {
      console.error("Error parsing items JSON:", parseError);
    }
  }

  // Notify matching providers in the region
  try {
    const { createNotification } = await import("./notification-actions");
    const originCity = formData.get("origin_city") as string;
    const originState = formData.get("origin_state") as string;

    // Find all providers serving this city
    const { data: providers } = await supabase
      .from("provider_service_areas")
      .select("provider_id, providers(user_id)")
      .eq("city", originCity)
      .eq("state", originState);

    if (providers && providers.length > 0) {
      // Send notification to each unique provider user
      const userIds = Array.from(new Set(providers.map(p => (p.providers as any)?.user_id).filter(Boolean)));
      
      await Promise.all(userIds.map(userId => 
        createNotification({
          userId: userId as string,
          title: "Nova oportunidade! 🚚",
          message: `Uma nova mudança de ${formData.get("origin_neighborhood")} para ${formData.get("dest_neighborhood")} foi publicada.`,
          type: "new_opportunity",
          actionUrl: `/prestador/oportunidade/${requestData.id}`,
        })
      ));
    }
  } catch (err) {
    console.error("Failed to notify providers:", err);
  }

  revalidatePath("/cliente");
  revalidatePath("/prestador");
  return { success: true };
}


