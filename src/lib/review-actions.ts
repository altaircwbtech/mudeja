"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notification-actions";

export async function submitReview(formData: {
  request_id: string;
  provider_id: string;
  rating: number;
  comment: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Usuário não autenticado" };

  if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
    return { error: "Avaliação inválida. Selecione de 1 a 5 estrelas." };
  }

  // 1. Insert the review
  const { error: reviewError } = await supabase
    .from("reviews")
    .insert({
      request_id: formData.request_id,
      reviewed_provider_id: formData.provider_id,
      reviewer_id: user.id,
      overall_rating: formData.rating,
      comment: formData.comment || null
    });

  if (reviewError) {
    console.error("Error submitting review:", reviewError);
    return { error: "Erro ao enviar avaliação" };
  }

  // 2. Update request status to completed (if it wasn't already)
  // This ensures the service is officially marked as finished.
  await supabase
    .from("service_requests")
    .update({ 
      status: "completed", 
      completed_at: new Date().toISOString() 
    })
    .eq("id", formData.request_id);

  // 3. Send notification to the provider
  try {
    const { data: providerData } = await supabase
      .from("providers")
      .select("user_id, business_name")
      .eq("id", formData.provider_id)
      .single();

    if (providerData) {
      await createNotification({
        userId: providerData.user_id,
        title: "Nova avaliação recebida! ⭐",
        message: `Um cliente avaliou seu serviço com ${formData.rating} estrelas.`,
        type: "new_review",
        actionUrl: "/prestador/perfil", // Or dedicated reviews page
      });
    }
  } catch (err) {
    console.error("Failed to notify provider about review:", err);
  }

  revalidatePath("/cliente");
  revalidatePath(`/cliente/solicitacao/${formData.request_id}`);
  revalidatePath(`/perfil/${formData.provider_id}`);
  revalidatePath("/explorar");

  return { success: true };
}
