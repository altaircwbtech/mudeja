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
    status: "published", // Publish immediately for the MVP
    
    origin_address: `${formData.get("origin_neighborhood")}, ${formData.get("origin_city")} - ${formData.get("origin_state")}`,
    origin_city: formData.get("origin_city"),
    origin_state: formData.get("origin_state"),
    origin_neighborhood: formData.get("origin_neighborhood"),
    origin_has_elevator: formData.get("origin_has_elevator") === "true",
    
    destination_city: formData.get("dest_city"),
    destination_state: formData.get("dest_state"),
    destination_neighborhood: formData.get("dest_neighborhood"),
    destination_has_elevator: formData.get("dest_has_elevator") === "true",
    
    preferred_date: formData.get("desired_date"),
    flexible_date: formData.get("is_date_flexible") === "true",
    
    needs_packing: formData.get("needs_packing") === "true",
    needs_disassembly: formData.get("needs_assembly") === "true",
    
    description,
  };

  const { data: requestData, error } = await supabase
    .from("service_requests")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    console.error("Error creating request:", error);
    return { error: "Ocorreu um erro ao criar a solicitação. Tente novamente." };
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

export async function submitReview(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const requestId = formData.get("request_id") as string;
  const providerId = formData.get("provider_id") as string;
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment") as string;

  if (!requestId || !providerId || !rating || rating < 1 || rating > 5) {
    throw new Error("Dados de avaliação inválidos.");
  }

  // Insert review
  const { error: reviewError } = await supabase.from("reviews").insert({
    request_id: requestId,
    reviewer_id: user.id,
    reviewed_provider_id: providerId,
    overall_rating: rating,
    comment: comment || null,
  });

  if (reviewError) {
    throw new Error(`Erro ao enviar avaliação: ${reviewError.message}`);
  }

  // Update request status to completed
  await supabase
    .from("service_requests")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", requestId);

  revalidatePath("/cliente");
  revalidatePath(`/perfil/${providerId}`);
  revalidatePath(`/cliente/solicitacao/${requestId}`);
  
  return { success: true };
}
