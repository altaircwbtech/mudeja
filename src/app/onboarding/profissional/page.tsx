import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import ProfessionalOnboardingClient from "./ProfessionalOnboardingClient";

export default async function ProfessionalOnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user already has a provider profile
  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (provider) {
    redirect("/prestador");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-orange-50/30 px-4 py-12">
      <div className="w-full max-w-xl space-y-8">
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>
        
        <ProfessionalOnboardingClient 
            userId={user.id} 
            fullName={profile?.full_name || ""} 
        />
      </div>
    </div>
  );
}
