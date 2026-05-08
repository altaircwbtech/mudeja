import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileEditClient from "./ProfileEditClient";
import PhotoGalleryClient from "./PhotoGalleryClient";

export default async function ProviderProfileSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch current user data
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  // Fetch provider data
  const { data: provider } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!provider) redirect("/onboarding");

  // Fetch provider photos
  const { data: photos } = await supabase
    .from("provider_photos")
    .select("*")
    .eq("provider_id", provider.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background px-4 shadow-sm">
        <Link href="/prestador">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold">Meu Perfil</h1>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900">Configurações de Conta</h2>
          <p className="text-muted-foreground text-sm">Mantenha seus dados e portfólio atualizados para atrair mais clientes.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5 items-start">
          <div className="lg:col-span-2 space-y-8">
            <ProfileEditClient 
              profile={profile} 
              provider={provider} 
            />
          </div>
          <div className="lg:col-span-3">
            <PhotoGalleryClient 
              initialPhotos={photos || []} 
              providerId={provider.id} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
