"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitProposal(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  // Verificar se é provedor
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userData?.role !== "provider") {
    throw new Error("Apenas prestadores podem enviar propostas");
  }

  // Buscar o ID do provedor
  const { data: providerData } = await supabase
    .from("providers")
    .select("id, users(full_name)")
    .eq("user_id", user.id)
    .single();

  if (!providerData) {
    throw new Error("Perfil de prestador não encontrado");
  }

  const requestId = formData.get("request_id") as string;
  const amountStr = formData.get("amount") as string;
  const message = formData.get("message") as string;

  // Clean the amount string (remove "R$ ", change "," to ".")
  const amountClean = amountStr.replace(/[^\d.,]/g, "").replace(",", ".");
  const amount = parseFloat(amountClean);

  if (isNaN(amount) || amount <= 0) {
    throw new Error(`Valor da proposta inválido: ${amountStr}`);
  }

  // Fetch the service request to get the client's user_id
  const { data: request } = await supabase
    .from("service_requests")
    .select("id, user_id, title")
    .eq("id", requestId)
    .single();

  if (!request) {
    throw new Error("Solicitação não encontrada");
  }

  // Check if a proposal already exists
  const { data: existingProposal } = await supabase
    .from("proposals")
    .select("id")
    .eq("request_id", requestId)
    .eq("provider_id", providerData.id)
    .single();

  if (existingProposal) {
    throw new Error("Você já enviou uma proposta para esta solicitação");
  }

  const { error } = await supabase.from("proposals").insert({
    request_id: requestId,
    provider_id: providerData.id,
    price: amount,
    message,
    status: "pending",
  });

  if (error) {
    console.error("Erro ao enviar proposta:", error);
    throw new Error(`Erro do Supabase: ${error.message} - Detalhes: ${error.details || ''}`);
  }

  // Create notification for the client
  try {
    const { createNotification } = await import("./notification-actions");
    const providerName = (providerData as any).users?.full_name || "Um motorista";
    await createNotification({
      userId: request.user_id,
      title: "Nova proposta recebida! 🚀",
      message: `${providerName} enviou uma oferta de R$ ${amount.toFixed(2).replace('.', ',')} para a sua solicitação.`,
      type: "proposal_received",
      actionUrl: `/cliente/solicitacao/${requestId}`,
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }

  revalidatePath("/prestador");
  revalidatePath(`/prestador/oportunidade/${requestId}`);
  
  return redirect("/prestador?success=proposal_sent");
}

export async function acceptProposal(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado");
  }

  const proposalId = formData.get("proposal_id") as string;
  const requestId = formData.get("request_id") as string;

  if (!proposalId || !requestId) {
    throw new Error("Dados inválidos");
  }

  // Verify the user owns the request
  const { data: request } = await supabase
    .from("service_requests")
    .select("id, status")
    .eq("id", requestId)
    .eq("user_id", user.id)
    .single();

  if (!request) {
    throw new Error("Solicitação não encontrada ou você não tem permissão");
  }

  if (request.status === "matched" || request.status === "in_progress" || request.status === "completed") {
    throw new Error("Esta solicitação já possui uma proposta aceita");
  }

  // Get the proposal provider_id
  const { data: proposal } = await supabase
    .from("proposals")
    .select("provider_id")
    .eq("id", proposalId)
    .single();

  if (!proposal) {
    throw new Error("Proposta não encontrada");
  }

  // Update request
  const { error: reqError } = await supabase
    .from("service_requests")
    .update({ 
      status: "matched", 
      chosen_proposal_id: proposalId,
      chosen_provider_id: proposal.provider_id,
      updated_at: new Date().toISOString()
    })
    .eq("id", requestId);

  if (reqError) {
    throw new Error(`Erro ao atualizar solicitação: ${reqError.message}`);
  }

  // Update proposal
  const { error: propError } = await supabase
    .from("proposals")
    .update({ 
      status: "accepted", 
      accepted_at: new Date().toISOString()
    })
    .eq("id", proposalId);

  if (propError) {
    throw new Error(`Erro ao atualizar proposta: ${propError.message}`);
  }

  // Reject all other proposals for this request (Optional, but good practice)
  await supabase
    .from("proposals")
    .update({ status: "rejected", rejected_at: new Date().toISOString() })
    .eq("request_id", requestId)
    .neq("id", proposalId);

  // Notify the accepted provider
  try {
    const { createNotification } = await import("./notification-actions");

    // Get the provider's user_id
    const { data: providerUser } = await supabase
      .from("providers")
      .select("user_id")
      .eq("id", proposal.provider_id)
      .single();

    if (providerUser) {
      await createNotification({
        userId: providerUser.user_id,
        title: "Proposta aceita! 🎉",
        message: "Um cliente aceitou a sua proposta. Você já pode entrar em contato!",
        type: "proposal_accepted",
        actionUrl: `/prestador/propostas`,
      });
    }
  } catch (err) {
    console.error("Failed to create notification:", err);
  }

  revalidatePath("/cliente");
  revalidatePath(`/cliente/solicitacao/${requestId}`);
  
  // We do not redirect here so the user stays on the page and sees the WhatsApp button appear!
}
