"use client";

import { createClient } from "@/lib/supabase/client";

export async function getProviderCredits() {
  const supabase = createClient();
  
  // Get provider ID first
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!provider) return null;

  const { data, error } = await supabase
    .from("provider_credits")
    .select("*")
    .eq("provider_id", provider.id)
    .single();

  if (error) {
    console.error("Error fetching credits:", error);
    return null;
  }

  return data;
}

export async function getCreditTransactions() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!provider) return [];

  const { data, error } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("provider_id", provider.id)
    .orderBy("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  return data;
}
