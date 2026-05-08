import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Truck, Plus, CheckCircle2, Trash2, Camera } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VehicleListClient from "./VehicleListClient";

export default async function VeiculosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get provider info
  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!provider) redirect("/onboarding");

  // Fetch vehicles
  const { data: vehicles } = await supabase
    .from("provider_vehicles")
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
        <h1 className="text-lg font-bold">Minha Frota</h1>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Veículos</h2>
            <p className="text-muted-foreground text-sm">Gerencie os veículos da sua empresa.</p>
          </div>
          {/* O botão de "Adicionar" será controlado pelo Client Component para abrir um Modal ou Form */}
        </div>

        <VehicleListClient 
            initialVehicles={vehicles || []} 
            providerId={provider.id} 
        />

        <div className="mt-10 rounded-2xl bg-primary/5 border border-primary/10 p-6">
            <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h4 className="font-bold text-primary">Trust Score Tip</h4>
                    <p className="text-sm text-slate-600 mt-1">
                        Perfis com pelo menos um veículo cadastrado ganham um bônus de **+0.5** no Trust Score. Adicione fotos reais para aumentar sua conversão!
                    </p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
