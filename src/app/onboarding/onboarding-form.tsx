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
import { Truck, User, MapPin, Phone, ChevronRight, Loader2 } from "lucide-react";

interface Props {
  userId: string;
  defaultName: string;
  defaultEmail: string;
}

type Role = "client" | "provider";

export function OnboardingForm({ userId, defaultName, defaultEmail }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
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
        services: ["mudanca_residencial"],
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

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex justify-center">
        <Logo size="lg" />
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader className="pb-4 text-center">
          <h1 className="text-2xl font-bold">
            {step === 1 ? "Como você quer usar a MovaFácil?" : "Complete seu perfil"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === 1
              ? "Escolha seu perfil — você pode mudar depois"
              : "Precisamos de algumas informações para começar"}
          </p>

          {/* Step indicator */}
          <div className="mt-4 flex justify-center gap-2">
            <div className={`h-1.5 w-12 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-1.5 w-12 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
          </div>
        </CardHeader>

        <CardContent>
          {step === 1 ? (
            <div className="space-y-4">
              {/* Client option */}
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                  role === "client"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Preciso de um serviço</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Quero solicitar mudança, carreto ou frete e receber propostas de profissionais.
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Grátis para sempre
                    </Badge>
                  </div>
                </div>
              </button>

              {/* Provider option */}
              <button
                type="button"
                onClick={() => setRole("provider")}
                className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                  role === "provider"
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-primary">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Sou motorista / ajudante</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Quero receber oportunidades de trabalho na minha região e enviar propostas.
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      3 propostas grátis/mês
                    </Badge>
                  </div>
                </div>
              </button>

              <Button
                onClick={() => role && setStep(2)}
                disabled={!role}
                className="w-full shadow-md shadow-primary/25"
                size="lg"
              >
                Continuar
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="full_name">Nome completo</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  WhatsApp
                </Label>
                <Input
                  id="phone"
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
                  <Label htmlFor="city" className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Cidade
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">UF</Label>
                  <Input
                    id="state"
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
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) =>
                    setFormData({ ...formData, neighborhood: e.target.value })
                  }
                  placeholder="Ex: Centro, Batel, Água Verde..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] shadow-md shadow-primary/25"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Começar a usar"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
