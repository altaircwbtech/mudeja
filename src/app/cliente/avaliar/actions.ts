"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(formData: {
  request_id: string;
  provider_id: string;
  rating: number;
  comment: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado" };

  // 1. Insert the review
  const { error: reviewError } = await supabase
    .from("reviews")
    .insert({
      request_id: formData.request_id,
      reviewed_provider_id: formData.provider_id,
      reviewer_id: user.id,
      overall_rating: formData.rating,
      comment: formData.comment
    });

  if (reviewError) {
    console.error("Error submitting review:", reviewError);
    return { error: "Erro ao enviar avaliação" };
  }

  // 2. The database trigger (recalculate_provider_ratings) will automatically 
  // update the provider's avg_rating and trust_score.

  // 3. Send notification to the provider
  const { data: providerUser } = await supabase
    .from("providers")
    .select("user_id, business_name")
    .eq("id", formData.provider_id)
    .single();

  if (providerUser) {
    await supabase.from("notifications").insert({
      user_id: providerUser.user_id,
      type: "new_review",
      title: "Nova Avaliação Recebida! ⭐",
      body: `Você recebeu uma nota ${formData.rating} pelo serviço realizado. Confira o que o cliente disse!`,
      data: { request_id: formData.request_id }
    });
  }

  revalidatePath("/cliente");
  revalidatePath(`/perfil/${formData.provider_id}`);
  revalidatePath("/explorar");

  return { success: true };
}
