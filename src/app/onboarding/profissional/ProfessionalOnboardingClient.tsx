"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Truck, Users, CheckCircle2, ChevronRight, Loader2, Sparkles } from "lucide-react";

interface Props {
  userId: string;
  fullName: string;
}

type ProviderType = "driver" | "helper";

export default function ProfessionalOnboardingClient({ userId, fullName }: Props) {
  const router = useRouter();
  const [type, setType] = useState<ProviderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleComplete(e: React.FormEvent) {
    e.preventDefault();
    if (!type) return;

    setLoading(true);
    setError("");

    const supabase = createClient();

    // 1. Update user role to provider (to grant access to the dashboard)
    const { error: userError } = await supabase
      .from("users")
      .update({ role: "provider" })
      .eq("id", userId);

    if (userError) {
      setError(userError.message);
      setLoading(false);
      return;
    }

    // 2. Create the provider profile
    const slug = fullName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const { error: providerError } = await supabase.from("providers").insert({
      user_id: userId,
      slug: `${slug}-${Date.now().toString(36)}`,
      business_name: fullName,
      type: type,
      services: type === "driver" ? ["mudanca_residencial"] : ["desmontagem_montagem"],
      is_active: true,
    });

    if (providerError) {
      setError(providerError.message);
      setLoading(false);
      return;
    }

    router.push("/prestador");
    router.refresh();
  }

  return (
    <Card className="border-none shadow-2xl overflow-hidden rounded-[32px]">
      <div className="bg-primary/10 px-8 py-6 flex items-center justify-between border-b border-primary/10">
        <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <span className="font-bold text-primary">Seja um Parceiro MovaFácil</span>
        </div>
      </div>

      <CardHeader className="p-8 text-center">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Olá, {fullName.split(" ")[0]}!
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          Escolha como você quer começar a ganhar dinheiro conosco.
        </p>
      </CardHeader>

      <CardContent className="p-8 pt-0">
        <div className="grid gap-6">
          {/* Driver option */}
          <button
            type="button"
            onClick={() => setType("driver")}
            className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${
              type === "driver"
                ? "border-primary bg-primary/5 shadow-inner"
                : "border-slate-100 hover:border-primary/40 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-5 relative z-10">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all ${
                type === "driver" ? "bg-primary text-white scale-110" : "bg-orange-50 text-primary"
              }`}>
                <Truck className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl text-slate-900">Sou Motorista</h3>
                  {type === "driver" && <CheckCircle2 className="h-6 w-6 text-primary" />}
                </div>
                <p className="mt-1 text-slate-500 leading-relaxed">
                  Possuo utilitário, picape ou caminhão e quero liderar mudanças e fretes.
                </p>
              </div>
            </div>
          </button>

          {/* Helper option */}
          <button
            type="button"
            onClick={() => setType("helper")}
            className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${
              type === "helper"
                ? "border-primary bg-primary/5 shadow-inner"
                : "border-slate-100 hover:border-primary/40 hover:bg-slate-50"
            }`}
          >
            <div className="flex items-center gap-5 relative z-10">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all ${
                type === "helper" ? "bg-primary text-white scale-110" : "bg-emerald-50 text-emerald-600"
              }`}>
                <Users className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xl text-slate-900">Sou Ajudante</h3>
                  {type === "helper" && <CheckCircle2 className="h-6 w-6 text-primary" />}
                </div>
                <p className="mt-1 text-slate-500 leading-relaxed">
                  Ofereço minha mão de obra e força física para ajudar em mudanças e montagens.
                </p>
              </div>
            </div>
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
                {error}
            </div>
          )}

          <Button
            onClick={handleComplete}
            disabled={!type || loading}
            className="w-full h-16 text-xl font-black shadow-2xl shadow-primary/20 rounded-2xl mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                Criando Perfil...
              </>
            ) : (
              <>
                Ativar Meu Perfil Profissional
                <ChevronRight className="ml-2 h-6 w-6" />
              </>
            )}
          </Button>
          
          <p className="text-center text-xs text-slate-400 mt-2">
            Você poderá completar os detalhes do seu perfil e cadastrar veículos (se houver) no seu novo painel.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
