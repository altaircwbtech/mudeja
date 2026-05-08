import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck, Trash2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleForm } from "./vehicle-form";
import { VehicleDeleteButton } from "./vehicle-delete-button";

export default async function VeiculosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!provider) redirect("/onboarding");

  // Fetch provider vehicles
  const { data: vehicles } = await supabase
    .from("provider_vehicles")
    .select("*")
    .eq("provider_id", provider.id)
    .order("created_at", { ascending: false });

  // Map enum to friendly name
  const vehicleTypeMap: Record<string, string> = {
    utilitario: "Utilitário",
    van: "Van",
    caminhonete: "Caminhonete",
    caminhao_34: "Caminhão 3/4",
    caminhao_toco: "Caminhão Toco",
    caminhao_truck: "Caminhão Truck",
    carreta: "Carreta",
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2 mr-2">
            <Link href="/prestador">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-bold">Meus Veículos</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* Adicionar Veículo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Adicionar Novo Veículo
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Cadastre a sua frota para mostrar aos clientes o que você usa para trabalhar.
            </p>
          </CardHeader>
          <CardContent>
            <VehicleForm />
          </CardContent>
        </Card>

        {/* Lista de Veículos */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Frota Cadastrada</h2>
          {!vehicles || vehicles.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Truck className="mb-4 h-12 w-12 opacity-20" />
                <p>Nenhum veículo cadastrado ainda.</p>
                <p className="text-sm">Cadastre seu primeiro veículo para aumentar suas chances!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-lg">{vehicleTypeMap[vehicle.vehicle_type] || vehicle.vehicle_type}</span>
                          {vehicle.is_primary && (
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-muted-foreground">
                          {vehicle.brand} {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ''}
                        </p>
                        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-muted-foreground block text-xs">Placa</span>
                            <span className="font-medium font-mono bg-muted px-1.5 py-0.5 rounded">{vehicle.plate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs">Capacidade</span>
                            <span className="font-medium">{vehicle.capacity_kg ? `${vehicle.capacity_kg} kg` : 'Não info.'}</span>
                          </div>
                        </div>
                      </div>
                      <VehicleDeleteButton vehicleId={vehicle.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
