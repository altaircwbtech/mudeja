import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronLeft, Trash2, Plus } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function ServiceAreasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get provider profile
  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!provider) redirect("/onboarding");

  // Fetch current service areas
  const { data: serviceAreas } = await supabase
    .from("provider_service_areas")
    .select("*")
    .eq("provider_id", provider.id)
    .order("created_at", { ascending: false });

  // Fetch available cities for the dropdown (all cities for now to avoid empty lists)
  const { data: availableCities } = await supabase
    .from("cities")
    .select("*")
    .order("name");

  // Server Action to add an area
  async function addArea(formData: FormData) {
    "use server";
    const cityId = formData.get("cityId") as string;
    const manualCity = formData.get("manualCity") as string;
    const supabase = await createClient();
    
    let cityName = "";
    let stateName = "PR"; // Default for now

    if (cityId) {
      // Get city info from DB
      const { data: cityData } = await supabase
        .from("cities")
        .select("name, state")
        .eq("id", cityId)
        .single();
      if (cityData) {
        cityName = cityData.name;
        stateName = cityData.state;
      }
    } else if (manualCity) {
      cityName = manualCity;
    }

    if (cityName && provider) {
      await supabase.from("provider_service_areas").insert({
        provider_id: provider.id,
        city: cityName,
        state: stateName,
      });
      revalidatePath("/prestador/perfil/areas");
      revalidatePath("/prestador");
    }
  }

  // Server Action to remove an area
  async function removeArea(id: string) {
    "use server";
    const supabase = await createClient();
    await supabase.from("provider_service_areas").delete().eq("id", id);
    revalidatePath("/prestador/perfil/areas");
    revalidatePath("/prestador");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <Link href="/prestador" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <Logo size="sm" />
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Áreas de Atendimento
          </h1>
          <p className="text-muted-foreground">
            Escolha as cidades onde você deseja realizar serviços.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Adicionar Nova Cidade</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addArea} className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                {availableCities && availableCities.length > 0 ? (
                  <select 
                    name="cityId" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Selecione na lista...</option>
                    {availableCities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name} - {city.state}
                      </option>
                    ))}
                  </select>
                ) : null}

                <div className="flex-1">
                  <input
                    type="text"
                    name="manualCity"
                    placeholder="Ou digite o nome da cidade..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <Button type="submit" className="gap-2 shrink-0">
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                * Se a cidade não aparecer na lista, você pode digitá-la manualmente no campo ao lado.
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Cidades Ativas ({serviceAreas?.length || 0})
          </h2>
          
          {serviceAreas?.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhuma cidade adicionada. Você verá oportunidades baseadas na cidade do seu perfil.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {serviceAreas?.map((area) => (
                <Card key={area.id} className="overflow-hidden">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold">{area.city}</p>
                        <p className="text-xs text-muted-foreground">{area.state}</p>
                      </div>
                    </div>
                    
                    <form action={async () => {
                      "use server";
                      await removeArea(area.id);
                    }}>
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <p className="text-sm text-blue-700">
            <strong>Dica:</strong> Quanto mais cidades você adicionar, mais oportunidades aparecerão no seu painel principal.
          </p>
        </div>
      </main>
    </div>
  );
}
