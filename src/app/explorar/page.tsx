import { createClient } from "@/lib/supabase/server";
import { Search, MapPin, Star, ShieldCheck, Filter, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/brand/Logo";
import FilterBarClient from "./FilterBarClient";

export default async function ExplorarPage({
  searchParams,
}: {
  searchParams: { 
    city?: string; 
    service?: string; 
    vehicle?: string;
  };
}) {
  const supabase = await createClient();
  const { city, service, vehicle } = searchParams;

  // Build query
  let query = supabase
    .from("providers")
    .select(`
      *,
      users!user_id (full_name, avatar_url, city, state),
      provider_service_areas (city, state),
      provider_vehicles (vehicle_type)
    `)
    .eq("is_active", true);

  // Apply filters
  if (service && service !== "all") {
    query = query.contains("services", [service]);
  }

  if (vehicle && vehicle !== "all") {
    query = query.eq("provider_vehicles.vehicle_type", vehicle);
  }

  // City filter (more complex due to joins, filtering via RPC or simple match for MVP)
  if (city) {
    // For MVP, we'll filter by the user's home city or service area match
    // Note: In a real large-scale app, we'd use an RPC for this type of complex OR filter
    query = query.ilike("users.city", `%${city}%`);
  }

  const { data: providers } = await query
    .order("trust_score", { ascending: false })
    .limit(40);

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20">
      {/* Header fixo */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          
          <div className="flex items-center gap-3">
             <Link href="/prestador">
                <Button variant="ghost" className="hidden sm:flex">Área do Prestador</Button>
             </Link>
             <Link href="/cliente/solicitar">
                <Button className="rounded-full shadow-lg shadow-primary/20">Pedir Orçamento</Button>
             </Link>
          </div>
        </div>
      </header>

      {/* Barra de Filtros Dinâmica */}
      <FilterBarClient />

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Título e Resultados */}
        <div className="mb-10 flex flex-col gap-2">
          <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
            {city ? `Profissionais em ${city}` : "Encontre os melhores profissionais"}
          </h1>
          <p className="text-muted-foreground">
            {providers?.length || 0} prestadores encontrados {vehicle !== "all" && `com veículo ${vehicle}`}
          </p>
        </div>

        {/* Grid de Prestadores */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {providers?.map((provider: any) => (
            <Link key={provider.id} href={`/perfil/${provider.id}`}>
              <Card className="group overflow-hidden border-none shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-48 w-full bg-slate-200">
                  {/* Placeholder ou Foto da Frota */}
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 group-hover:scale-105 transition-transform duration-500">
                    <Truck className="h-12 w-12 text-slate-300" />
                  </div>
                  
                  {/* Badge de Trust Score */}
                  <div className="absolute left-3 top-3">
                    <div className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur px-3 py-1.5 text-xs font-black shadow-sm">
                      <ShieldCheck className="h-4 w-4 text-green-500" />
                      TRUST {provider.trust_score?.toFixed(1) || "0.0"}
                    </div>
                  </div>

                  {/* Foto de Perfil Sobreposta */}
                  <div className="absolute -bottom-6 left-6 h-14 w-14 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden">
                    {provider.users?.avatar_url ? (
                        <img src={provider.users.avatar_url} alt={provider.business_name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-white font-bold">
                            {provider.business_name?.substring(0,1) || "M"}
                        </div>
                    )}
                  </div>
                </div>

                <CardContent className="pt-8 pb-5 px-5">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                    {provider.business_name}
                  </h3>
                  
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      {provider.avg_rating > 0 ? provider.avg_rating.toFixed(1) : "Novo"}
                    </div>
                    <div className="text-slate-400">•</div>
                    <div className="text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {provider.users?.city || "Brasil"}
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-slate-500 line-clamp-2 min-h-[40px]">
                    {provider.description || "Motorista profissional especializado em serviços de transporte e mudanças."}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        A partir de <span className="text-slate-900 text-sm">R$ 150</span>
                    </div>
                    <Button variant="ghost" size="sm" className="font-bold text-primary hover:text-primary hover:bg-primary/5">
                        Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {(!providers || providers.length === 0) && (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Nenhum resultado</h3>
                <p className="text-muted-foreground mt-2">Tente ajustar seus filtros ou buscar em outra cidade.</p>
                <Button variant="outline" className="mt-6 rounded-full" onClick={() => {}}>Limpar Filtros</Button>
            </div>
        )}
      </main>
    </div>
  );
}
