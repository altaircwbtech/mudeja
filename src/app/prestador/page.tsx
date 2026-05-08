import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth-actions";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notification-bell";
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

  // Fetch proposals sent by this provider
  const { data: myProposals } = await supabase
    .from("proposals")
    .select("request_id")
    .eq("provider_id", provider?.id);

  const sentRequestIds = new Set(myProposals?.map((p) => p.request_id) || []);

  // Fetch available opportunities (published requests)
  const { data: opportunities } = await supabase
    .from("service_requests")
    .select("*")
    .in("status", ["published", "receiving_proposals"])
    .order("created_at", { ascending: false })
    .limit(10);

  // Fetch provider vehicles to check profile completeness
  const { data: myVehicles } = await supabase
    .from("provider_vehicles")
    .select("id")
    .eq("provider_id", provider?.id)
    .limit(1);

  const hasVehicles = (myVehicles?.length || 0) > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs gap-1 hidden sm:flex">
              <Truck className="h-3 w-3" />
              Parceiro
            </Badge>
            <NotificationBell />
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="sm">
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
            { icon: ClipboardList, label: "Propostas", value: myProposals?.length || 0, href: "/prestador/propostas" },
            { icon: Star, label: "Avaliação", value: provider?.avg_rating || "—", href: "/prestador/avaliacoes" },
            { icon: TrendingUp, label: "Taxa resp.", value: `${provider?.response_rate || 0}%` },
            { icon: Zap, label: "Trust Score", value: provider?.trust_score || "0.0" },
          ].map((stat) => {
            const CardWrap = (
              <Card className={`transition-all ${stat.href ? 'hover:border-primary/50 hover:shadow-md cursor-pointer' : ''}`}>
                <CardContent className="p-4 text-center">
                  <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );

            return stat.href ? (
              <Link key={stat.label} href={stat.href}>
                {CardWrap}
              </Link>
            ) : (
              <div key={stat.label}>{CardWrap}</div>
            );
          })}
        </div>

        {/* Opportunities list */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Oportunidades na sua região
            </h2>
            <Badge variant="secondary" className="text-xs">
              {opportunities?.length || 0} novas
            </Badge>
          </div>

          {!opportunities || opportunities.length === 0 ? (
            <Card>
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
          ) : (
            <div className="grid gap-4">
              {opportunities.map((opp) => (
                <Card key={opp.id} className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-md cursor-pointer group">
                  <div className="border-l-4 border-orange-500">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              {opp.service_type === 'mudanca_residencial' ? 'Mudança' : 'Frete'}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Criado hoje
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{opp.title}</h3>
                          
                          <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 shrink-0" />
                              <span className="truncate">{opp.origin_city} → {opp.destination_city || opp.dest_city}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Truck className="h-4 w-4 shrink-0" />
                              Tamanho: <strong className="text-foreground capitalize">{opp.move_size || 'Não especificado'}</strong>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end justify-between h-full space-y-4">
                          {sentRequestIds.has(opp.id) ? (
                            <Button asChild size="sm" variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200 z-10 relative">
                              <Link href={`/prestador/oportunidade/${opp.id}`}>
                                Oferta Enviada ✓
                              </Link>
                            </Button>
                          ) : (
                            <Button asChild size="sm" className="shadow-sm z-10 relative">
                              <Link href={`/prestador/oportunidade/${opp.id}`}>
                                Ver Detalhes
                              </Link>
                            </Button>
                          )}
                          <div className="text-xs text-muted-foreground font-medium">
                            {opp.total_proposals || 0} proposta(s)
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

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
              { label: "Veículo cadastrado", done: hasVehicles, href: "/prestador/perfil/veiculos" },
              { label: "Área de atendimento", done: false },
              { label: "Fotos de trabalhos", done: false },
            ].map((item) => {
              const content = (
                <div
                  key={item.label}
                  className={`flex items-center justify-between rounded-lg border p-3 ${item.href ? 'hover:border-primary/50 cursor-pointer bg-primary/5 transition-colors' : ''}`}
                >
                  <span className="text-sm font-medium">{item.label} {item.href && !item.done && <span className="text-xs text-primary font-bold ml-2">Começar →</span>}</span>
                  {item.done ? (
                    <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100 border-none">
                      ✓ Feito
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Pendente
                    </Badge>
                  )}
                </div>
              );

              return item.href ? (
                <Link key={item.label} href={item.href} className="block">
                  {content}
                </Link>
              ) : content;
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
