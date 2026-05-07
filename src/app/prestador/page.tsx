import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth-actions";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  ClipboardList,
  Star,
  LogOut,
  MapPin,
  TrendingUp,
  Bell,
  Settings,
  Zap,
} from "lucide-react";

export default async function PrestadorDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  // Get provider profile
  const { data: provider } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs gap-1">
              <Truck className="h-3 w-3" />
              Parceiro
            </Badge>
            <form action={signOut}>
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">
            Olá, {profile.full_name?.split(" ")[0]}! 🚚
          </h1>
          <p className="text-muted-foreground">
            Veja as oportunidades na sua região
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: ClipboardList, label: "Propostas", value: provider?.total_completed || 0 },
            { icon: Star, label: "Avaliação", value: provider?.avg_rating || "—" },
            { icon: TrendingUp, label: "Taxa resp.", value: `${provider?.response_rate || 0}%` },
            { icon: Zap, label: "Trust Score", value: provider?.trust_score || "0.0" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Opportunities placeholder */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Oportunidades perto de você</h2>
              <Badge variant="secondary" className="text-xs gap-1">
                <MapPin className="h-3 w-3" />
                {profile.city}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-1 font-semibold">Nenhuma oportunidade no momento</h3>
              <p className="text-sm text-muted-foreground">
                Quando clientes solicitarem serviços na sua região, você verá aqui.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile completeness */}
        <Card>
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold">Completar perfil</h2>
            <p className="text-sm text-muted-foreground">
              Perfis completos recebem mais oportunidades
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Foto de perfil", done: !!profile.avatar_url },
              { label: "Verificação de identidade", done: provider?.selfie_verified },
              { label: "Veículo cadastrado", done: false },
              { label: "Área de atendimento", done: false },
              { label: "Fotos de trabalhos", done: false },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <span className="text-sm">{item.label}</span>
                {item.done ? (
                  <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">
                    ✓ Feito
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Pendente
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
