import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user already completed onboarding
  const { data: profile } = await supabase
    .from("users")
    .select("role, phone, city")
    .eq("id", user.id)
    .single();

  // If profile has phone and city, onboarding is complete
  if (profile?.phone && profile?.city) {
    if (profile.role === "provider") {
      redirect("/prestador");
    }
    redirect("/cliente");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-orange-50/30 px-4 py-12">
      <OnboardingForm
        userId={user.id}
        defaultName={user.user_metadata?.full_name || ""}
        defaultEmail={user.email || ""}
      />
    </div>
  );
}
