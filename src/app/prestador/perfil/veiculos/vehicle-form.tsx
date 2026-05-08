"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addVehicle } from "@/lib/vehicle-actions";

export function VehicleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await addVehicle(formData);
      toast.success("Veículo cadastrado!", { description: "Seu veículo foi salvo com sucesso." });
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      toast.error("Erro ao salvar", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="vehicle_type">Tipo de Veículo</Label>
        <select 
          name="vehicle_type" 
          id="vehicle_type" 
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Selecione...</option>
          <option value="utilitario">Utilitário (Fiorino, Kangoo)</option>
          <option value="van">Van / Furgão</option>
          <option value="caminhonete">Caminhonete (HR, Bongo)</option>
          <option value="caminhao_34">Caminhão 3/4</option>
          <option value="caminhao_toco">Caminhão Toco</option>
          <option value="caminhao_truck">Caminhão Truck</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand">Marca</Label>
          <Input id="brand" name="brand" placeholder="Ex: Hyundai" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Modelo</Label>
          <Input id="model" name="model" placeholder="Ex: HR" required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Ano</Label>
          <Input id="year" name="year" type="number" placeholder="Ex: 2018" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plate">Placa</Label>
          <Input id="plate" name="plate" placeholder="ABC-1234" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity_kg">Capac. (kg)</Label>
          <Input id="capacity_kg" name="capacity_kg" type="number" placeholder="Ex: 1800" />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Salvando..." : "Cadastrar Veículo"}
      </Button>
    </form>
  );
}
