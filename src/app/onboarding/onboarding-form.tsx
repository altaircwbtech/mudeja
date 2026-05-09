"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  User, 
  MapPin, 
  Phone, 
  ChevronRight, 
  Loader2, 
  Users, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface Props {
  userId: string;
  defaultName: string;
  defaultEmail: string;
}

type Role = "client" | "provider";
type ProviderType = "driver" | "helper";

export function OnboardingForm({ userId, defaultName, defaultEmail }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [providerType, setProviderType] = useState<ProviderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    full_name: defaultName,
    phone: "",
    city: "Curitiba",
    state: "PR",
    neighborhood: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("users")
      .update({
        role,
        full_name: formData.full_name,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        neighborhood: formData.neighborhood,
      })
      .eq("id", userId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // If provider, create provider profile
    if (role === "provider") {
      const slug = formData.full_name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const { error: providerError } = await supabase.from("providers").insert({
        user_id: userId,
        slug: `${slug}-${Date.now().toString(36)}`,
        business_name: formData.full_name,
        services: providerType === "driver" ? ["mudanca_residencial"] : ["desmontagem_montagem"],
        type: providerType,
      });

      if (providerError) {
        setError(providerError.message);
        setLoading(false);
        return;
      }
    }

    router.push(role === "provider" ? "/prestador" : "/cliente");
    router.refresh();
  }

  const handleSelectRole = (selectedRole: Role, type?: ProviderType) => {
    setRole(selectedRole);
    if (type) setProviderType(type);
    else setProviderType(null);
  };

  return (
    <div className="w-full max-w-xl space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-center">
        <Logo size="lg" />
      </div>

      <Card className="border-none shadow-2xl overflow-hidden rounded-[32px]">
        <div className="h-2 w-full bg-slate-100">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out" 
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
        
        <CardHeader className="pb-4 pt-8 text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {step === 1 ? "Como você quer usar a MovaFácil?" : "Quase lá!"}
          </h1>
          <p className="text-slate-500 mt-2">
            {step === 1
              ? "Escolha seu perfil inicial para personalizarmos sua experiência."
              : "Só precisamos de alguns contatos para ativar sua conta."}
          </p>
        </CardHeader>

        <CardContent className="p-8">
          {step === 1 ? (
            <div className="space-y-4">
              {/* Client option */}
              <button
                type="button"
                onClick={() => handleSelectRole("client")}
                className={`w-full group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${
                  role === "client"
                    ? "border-primary bg-primary/5 shadow-inner"
                    : "border-slate-100 hover:border-primary/40 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all ${
                    role === "client" ? "bg-primary text-white scale-110" : "bg-blue-50 text-blue-500"
                  }`}>
                    <User className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-slate-900">Sou Cliente</h3>
                      {role === "client" && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                      Quero solicitar orçamentos e encontrar os melhores profissionais para minha mudança.
                    </p>
                  </div>
                </div>
              </button>

              {/* Driver option */}
              <button
                type="button"
                onClick={() => handleSelectRole("provider", "driver")}
                className={`w-full group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${
                  role === "provider" && providerType === "driver"
                    ? "border-primary bg-primary/5 shadow-inner"
                    : "border-slate-100 hover:border-primary/40 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all ${
                    role === "provider" && providerType === "driver" ? "bg-primary text-white scale-110" : "bg-orange-50 text-primary"
                  }`}>
                    <Truck className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-slate-900">Sou Motorista</h3>
                      {role === "provider" && providerType === "driver" && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                      Tenho veículo e quero liderar mudanças, carretos e fretes na minha região.
                    </p>
                  </div>
                </div>
              </button>

              {/* Helper option */}
              <button
                type="button"
                onClick={() => handleSelectRole("provider", "helper")}
                className={`w-full group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${
                  role === "provider" && providerType === "helper"
                    ? "border-primary bg-primary/5 shadow-inner"
                    : "border-slate-100 hover:border-primary/40 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all ${
                    role === "provider" && providerType === "helper" ? "bg-primary text-white scale-110" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    <Users className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-slate-900">Sou Ajudante</h3>
                      {role === "provider" && providerType === "helper" && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </div>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                      Quero oferecer minha mão de obra para carregar, descarregar ou montar móveis.
                    </p>
                  </div>
                </div>
              </button>

              <Button
                onClick={() => role && setStep(2)}
                disabled={!role}
                className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 rounded-2xl mt-4"
              >
                Continuar
                <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-slate-700 font-bold ml-1">Nome completo</Label>
                <Input
                  id="full_name"
                  className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-bold ml-1 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  WhatsApp
                </Label>
                <Input
                  id="phone"
                  className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(41) 99999-9999"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="city" className="text-slate-700 font-bold ml-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    Cidade
                  </Label>
                  <Input
                    id="city"
                    className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-slate-700 font-bold ml-1">UF</Label>
                  <Input
                    id="state"
                    className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20 text-center font-bold"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        state: e.target.value.toUpperCase().slice(0, 2),
                      })
                    }
                    maxLength={2}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood" className="text-slate-700 font-bold ml-1">Bairro principal</Label>
                <Input
                  id="neighborhood"
                  className="h-12 rounded-xl border-slate-200 focus:border-primary focus:ring-primary/20"
                  value={formData.neighborhood}
                  onChange={(e) =>
                    setFormData({ ...formData, neighborhood: e.target.value })
                  }
                  placeholder="Ex: Centro, Batel, Água Verde..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="h-14 px-8 rounded-2xl border-slate-200 font-bold text-slate-600"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-14 text-lg font-bold shadow-xl shadow-primary/20 rounded-2xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Ativando...
                    </>
                  ) : (
                    "Finalizar Cadastro"
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-4 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Seus dados estão protegidos. Ao finalizar, você concorda com nossos termos de uso e privacidade.
                </p>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
