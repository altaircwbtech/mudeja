"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRequest } from "@/lib/request-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Home,
  Briefcase,
  Truck,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  Loader2,
} from "lucide-react";

const SERVICE_TYPES = [
  { id: "mudanca_residencial", label: "Mudança Residencial", icon: Home, desc: "Casa ou apartamento completo" },
  { id: "mudanca_comercial", label: "Mudança Comercial", icon: Briefcase, desc: "Escritório ou loja" },
  { id: "carreto", label: "Carreto", icon: Truck, desc: "Poucos itens, trajeto curto" },
  { id: "frete_pequeno", label: "Frete Pequeno", icon: Package, desc: "Apenas 1 ou 2 móveis/eletros" },
];

const MOVE_SIZES = [
  { id: "pequeno", label: "Pequeno (1 cômodo)" },
  { id: "medio", label: "Médio (2 a 3 cômodos)" },
  { id: "grande", label: "Grande (4+ cômodos)" },
];

export function RequestForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    service_type: "",
    move_size: "",
    origin_city: "",
    origin_state: "PR",
    origin_neighborhood: "",
    origin_has_elevator: false,
    origin_stairs_flights: 0,
    dest_city: "",
    dest_state: "PR",
    dest_neighborhood: "",
    dest_has_elevator: false,
    dest_stairs_flights: 0,
    desired_date: "",
    is_date_flexible: true,
    needs_packing: false,
    needs_assembly: false,
    needs_helper: false,
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError("");

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value.toString());
    });

    const result = await createRequest(formDataObj);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/cliente?success=request_created");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* STEP 1: Service Type */}
      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in">
          <div>
            <h2 className="text-xl font-semibold">Qual serviço você precisa?</h2>
            <p className="text-sm text-muted-foreground">
              Selecione a opção que melhor descreve sua necessidade.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, service_type: type.id });
                  setStep(2);
                }}
                className={`flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all ${
                  formData.service_type === type.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-muted/50"
                }`}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                  formData.service_type === type.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <type.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{type.label}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {type.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Addresses and Dates */}
      {step === 2 && (
        <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
          <div>
            <h2 className="text-xl font-semibold">Locais e Data</h2>
            <p className="text-sm text-muted-foreground">
              De onde para onde e quando vai acontecer?
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Origin */}
            <Card className="border-orange-100 bg-orange-50/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <MapPin className="h-4 w-4" />
                  Origem (Retirada)
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    value={formData.origin_city}
                    onChange={(e) => setFormData({ ...formData, origin_city: e.target.value })}
                    placeholder="Ex: Curitiba"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input
                    value={formData.origin_neighborhood}
                    onChange={(e) => setFormData({ ...formData, origin_neighborhood: e.target.value })}
                    placeholder="Ex: Água Verde"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="origin_elevator"
                    checked={formData.origin_has_elevator}
                    onCheckedChange={(c) => setFormData({ ...formData, origin_has_elevator: !!c })}
                  />
                  <Label htmlFor="origin_elevator" className="font-normal">Tem elevador disponível</Label>
                </div>
              </CardContent>
            </Card>

            {/* Destination */}
            <Card className="border-blue-100 bg-blue-50/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 font-semibold text-blue-600">
                  <MapPin className="h-4 w-4" />
                  Destino (Entrega)
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    value={formData.dest_city}
                    onChange={(e) => setFormData({ ...formData, dest_city: e.target.value })}
                    placeholder="Ex: Curitiba"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input
                    value={formData.dest_neighborhood}
                    onChange={(e) => setFormData({ ...formData, dest_neighborhood: e.target.value })}
                    placeholder="Ex: Batel"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="dest_elevator"
                    checked={formData.dest_has_elevator}
                    onCheckedChange={(c) => setFormData({ ...formData, dest_has_elevator: !!c })}
                  />
                  <Label htmlFor="dest_elevator" className="font-normal">Tem elevador disponível</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Data prevista
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Data preferencial</Label>
                <Input
                  type="date"
                  value={formData.desired_date}
                  onChange={(e) => setFormData({ ...formData, desired_date: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox
                  id="flexible"
                  checked={formData.is_date_flexible}
                  onCheckedChange={(c) => setFormData({ ...formData, is_date_flexible: !!c })}
                />
                <Label htmlFor="flexible" className="font-normal">
                  Tenho flexibilidade de 2 a 3 dias (ajuda a ter preços melhores)
                </Label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Details */}
      {step === 3 && (
        <div className="space-y-8 animate-in slide-in-from-right-4 fade-in">
          <div>
            <h2 className="text-xl font-semibold">Tamanho e Detalhes</h2>
            <p className="text-sm text-muted-foreground">
              Para o profissional enviar um orçamento correto.
            </p>
          </div>

          <div className="space-y-3">
            <Label>Tamanho estimado</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {MOVE_SIZES.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, move_size: size.id })}
                  className={`rounded-lg border p-3 text-sm transition-all ${
                    formData.move_size === size.id
                      ? "border-primary bg-primary/10 font-medium text-primary"
                      : "hover:border-primary/50"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t pt-6">
            <Label>Serviços Adicionais Necessários</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
                <Checkbox
                  checked={formData.needs_helper}
                  onCheckedChange={(c) => setFormData({ ...formData, needs_helper: !!c })}
                  className="mt-0.5"
                />
                <span className="text-sm font-medium">Ajudante(s)</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
                <Checkbox
                  checked={formData.needs_packing}
                  onCheckedChange={(c) => setFormData({ ...formData, needs_packing: !!c })}
                  className="mt-0.5"
                />
                <span className="text-sm font-medium">Embalagem</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-muted/50">
                <Checkbox
                  checked={formData.needs_assembly}
                  onCheckedChange={(c) => setFormData({ ...formData, needs_assembly: !!c })}
                  className="mt-0.5"
                />
                <span className="text-sm font-medium">Montagem de Móveis</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 border-t pt-6">
            <Label>Descreva os itens (opcional, mas recomendado)</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: 1 geladeira, 1 sofá de 3 lugares, cama box casal, umas 10 caixas médias..."
              className="min-h-[120px]"
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 1 || loading}
        >
          Voltar
        </Button>
        
        <Button
          type="submit"
          className="shadow-md shadow-primary/25 min-w-[140px]"
          disabled={loading || (step === 1 && !formData.service_type) || (step === 3 && !formData.move_size)}
        >
          {loading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publicando...</>
          ) : step === 3 ? (
            "Publicar Solicitação"
          ) : (
            <><span className="mr-1">Próximo Passo</span> <ArrowRight className="h-4 w-4" /></>
          )}
        </Button>
      </div>
    </form>
  );
}
