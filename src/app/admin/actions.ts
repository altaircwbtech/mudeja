"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveProviderDocument(providerId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado" };

  // Verify admin role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "Não autorizado" };

  const { error } = await supabase
    .from("providers")
    .update({ 
      document_verified: true,
      updated_at: new Date().toISOString()
    })
    .eq("id", providerId);

  if (error) {
    console.error("Error approving document:", error);
    return { error: "Erro ao aprovar documento" };
  }

  // Find user_id to send notification
  const { data: provider } = await supabase
    .from("providers")
    .select("user_id")
    .eq("id", providerId)
    .single();

  if (provider) {
    await supabase.from("notifications").insert({
      user_id: provider.user_id,
      type: "profile_verified",
      title: "Documentos Aprovados! 🎉",
      body: "Sua CNH/CRLV foram validados. Seu Trust Score aumentou e você agora é um motorista verificado!",
      data: { provider_id: providerId }
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/verificacoes");
  revalidatePath("/explorar");
  
  return { success: true };
}

export async function rejectProviderDocument(providerId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado" };

  // Verify admin role
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return { error: "Não autorizado" };

  const { error } = await supabase
    .from("providers")
    .update({ 
      document_verified: false, // Explicitly keep as false
      updated_at: new Date().toISOString()
    })
    .eq("id", providerId);

  if (error) return { error: "Erro ao processar rejeição" };

  // Find user_id to send notification
  const { data: provider } = await supabase
    .from("providers")
    .select("user_id")
    .eq("id", providerId)
    .single();

  if (provider) {
    await supabase.from("notifications").insert({
      user_id: provider.user_id,
      type: "system",
      title: "Documento Rejeitado ⚠️",
      body: `Houve um problema com a validação do seu documento: ${reason}. Por favor, envie novamente no seu perfil.`,
      data: { provider_id: providerId, reason }
    });
  }

  revalidatePath("/admin/verificacoes");
  return { success: true };
}
