import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProviderPhotosClient from "./ProviderPhotosClient";

export default async function ProviderPhotosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get provider profile
  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!provider) redirect("/onboarding");

  // Fetch current photos
  const { data: photos } = await supabase
    .from("provider_photos")
    .select("*")
    .eq("provider_id", provider.id)
    .order("created_at", { ascending: false });

  return (
    <ProviderPhotosClient 
      providerId={provider.id} 
      initialPhotos={photos || []} 
    />
  );
}
