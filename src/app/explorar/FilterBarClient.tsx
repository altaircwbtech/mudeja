"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, Truck, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const VEHICLE_TYPES = [
  { value: "utilitario", label: "Utilitário / Fiorino" },
  { value: "van", label: "Van" },
  { value: "caminhonete", label: "Caminhonete" },
  { value: "caminhao_34", label: "Caminhão 3/4" },
  { value: "caminhao_toco", label: "Caminhão Toco" },
  { value: "caminhao_truck", label: "Caminhão Truck" },
  { value: "carreta", label: "Carreta" },
];

const SERVICE_TYPES = [
  { value: "mudanca_residencial", label: "Mudança Residencial" },
  { value: "mudanca_comercial", label: "Mudança Comercial" },
  { value: "carreto", label: "Carreto" },
  { value: "frete_pequeno", label: "Fretes Pequenos" },
];

export default function FilterBarClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [vehicle, setVehicle] = useState(searchParams.get("vehicle") || "all");
  const [service, setService] = useState(searchParams.get("service") || "all");

  // Sync with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (city) params.set("city", city); else params.delete("city");
    if (vehicle !== "all") params.set("vehicle", vehicle); else params.delete("vehicle");
    if (service !== "all") params.set("service", service); else params.delete("service");

    const query = params.toString();
    router.push(`/explorar${query ? `?${query}` : ""}`);
  }, [city, vehicle, service, router]);

  const clearFilters = () => {
    setCity("");
    setVehicle("all");
    setService("all");
  };

  const hasFilters = city || vehicle !== "all" || service !== "all";

  return (
    <div className="sticky top-16 z-40 w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          
          {/* Cidade */}
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Onde você está? (Ex: Curitiba)"
              className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Tipo de Veículo */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 gap-2 border-slate-200 bg-slate-50 hover:bg-white transition-all">
                  <Truck className="h-4 w-4 text-slate-500" />
                  {vehicle === "all" ? "Tipo de Veículo" : VEHICLE_TYPES.find(v => v.value === vehicle)?.label}
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filtrar por Veículo</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={vehicle} onValueChange={setVehicle}>
                  <DropdownMenuRadioItem value="all">Todos os Veículos</DropdownMenuRadioItem>
                  {VEHICLE_TYPES.map((v) => (
                    <DropdownMenuRadioItem key={v.value} value={v.value}>
                      {v.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tipo de Serviço */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 gap-2 border-slate-200 bg-slate-50 hover:bg-white transition-all">
                  <Search className="h-4 w-4 text-slate-500" />
                  {service === "all" ? "Especialidade" : SERVICE_TYPES.find(s => s.value === service)?.label}
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Especialidade</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={service} onValueChange={setService}>
                  <DropdownMenuRadioItem value="all">Todas</DropdownMenuRadioItem>
                  {SERVICE_TYPES.map((s) => (
                    <DropdownMenuRadioItem key={s.value} value={s.value}>
                      {s.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {hasFilters && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-11 w-11 text-slate-400 hover:text-red-500 hover:bg-red-50"
                onClick={clearFilters}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
