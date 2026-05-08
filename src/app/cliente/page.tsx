import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth-actions";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotificationBell } from "@/components/notification-bell";
import {
  Search,
  Plus,
  ClipboardList,
  Star,
  LogOut,
  User,
  MapPin,
  Truck,
} from "lucide-react";

export default async function ClienteDashboard() {
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

  // Fetch client requests with reviews check and provider info
  const { data: requests } = await supabase
    .from("service_requests")
    .select(`
      *,
      reviews (id),
      provider:providers!matched_provider_id (
        business_name,
        user:users!user_id (full_name)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const activeRequestsCount = requests?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {profile.full_name?.split(" ")[0]}
            </span>
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
            Olá, {profile.full_name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            O que você precisa mover hoje?
          </p>
        </div>

        {/* Quick actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Link href="/cliente/nova-solicitacao">
            <Card className="group h-full cursor-pointer border-2 border-primary/20 bg-primary/5 transition-all hover:border-primary hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                  <Plus className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-semibold">Nova solicitação</h3>
                  <p className="text-sm text-muted-foreground">
                    Descreva o que precisa e receba propostas
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/explorar">
            <Card className="group h-full cursor-pointer transition-all hover:border-primary hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Search className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-semibold">Buscar profissional</h3>
                  <p className="text-sm text-muted-foreground">
                    Veja perfis de motoristas e ajudantes
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Minha atividade</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: ClipboardList, label: "Solicitações", value: activeRequestsCount.toString() },
              { icon: Star, label: "Avaliações", value: requests?.filter(r => r.reviews?.length > 0).length.toString() || "0" },
              { icon: MapPin, label: "Cidade", value: profile.city || "—" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 text-center">
                  <stat.icon className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Minhas Solicitações Recentes */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Minhas Solicitações</h2>
            {activeRequestsCount > 0 && (
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            )}
          </div>
          
          {activeRequestsCount === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <ClipboardList className="mb-4 h-12 w-12 opacity-20" />
                <p>Nenhuma solicitação ativa</p>
                <Link href="/cliente/nova-solicitacao" className="mt-4">
                  <Button variant="outline" size="sm">
                    Criar a primeira
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {requests?.slice(0, 5).map((req: any) => {
                const needsReview = req.status === "completed" && (!req.reviews || req.reviews.length === 0);
                
                return (
                  <Card key={req.id} className={`overflow-hidden hover:shadow-md transition-shadow ${needsReview ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : ''}`}>
                    <div className={`border-l-4 ${needsReview ? 'border-amber-500' : 'border-primary'}`}>
                      <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {(() => {
                                let badgeColor = "bg-orange-100 text-orange-800 hover:bg-orange-200 border-none";
                                let badgeText = req.status;

                                switch (req.status) {
                                  case "published":
                                  case "receiving_proposals":
                                    badgeText = "Buscando Profissionais";
                                    badgeColor = "bg-orange-100 text-orange-800 hover:bg-orange-200 border-none";
                                    break;
                                  case "matched":
                                    badgeText = "Motorista Encontrado";
                                    badgeColor = "bg-blue-100 text-blue-800 hover:bg-blue-200 border-none";
                                    break;
                                  case "completed":
                                    badgeText = "Finalizada";
                                    badgeColor = "bg-green-100 text-green-800 hover:bg-green-200 border-none";
                                    break;
                                }

                                return (
                                  <Badge variant="secondary" className={`mb-2 ${badgeColor}`}>
                                    {badgeText}
                                  </Badge>
                                );
                              })()}
                              <span className="mb-2 text-xs text-muted-foreground">
                                {new Date(req.created_at).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                            <h3 className="font-semibold text-lg">{req.title}</h3>
                            <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" /> {req.origin_city} → {req.destination_city || req.dest_city}
                            </p>
                            
                            {req.provider && (
                                <p className="mt-2 text-xs font-medium text-slate-500">
                                    Motorista: <span className="text-slate-900">{req.provider.business_name || req.provider.user?.[0]?.full_name}</span>
                                </p>
                            )}
                          </div>
                          
                          <div className="w-full sm:w-auto flex flex-col items-end gap-2">
                            {!needsReview && (
                              <>
                                <div className={`text-2xl font-bold ${req.total_proposals > 0 ? 'text-green-600' : 'text-primary'}`}>{req.total_proposals || 0}</div>
                                <div className="text-xs text-muted-foreground font-medium">propostas</div>
                                <Link href={`/cliente/solicitacao/${req.id}`}>
                                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
                                        Ver Detalhes
                                    </Button>
                                </Link>
                              </>
                            )}
                            
                            {needsReview && (
                                <Link href={`/cliente/avaliar/${req.id}`} className="w-full">
                                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold gap-2 shadow-lg shadow-amber-500/20">
                                        <Star className="h-4 w-4 fill-current" /> Avaliar Agora
                                    </Button>
                                </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Explore CTA */}
        <div className="mt-8 mb-4">
           <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none shadow-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 h-32 w-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/20 transition-all duration-500" />
              <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6 relative z-10">
                 <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner shrink-0">
                    <Truck className="h-8 w-8 text-primary" />
                 </div>
                 <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-bold">Conheça nossos Motoristas Elite</h3>
                    <p className="text-slate-400 text-sm mt-1">Veja os profissionais com as melhores avaliações e Trust Score da sua região.</p>
                 </div>
                 <Link href="/explorar">
                    <Button className="font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-95">
                       Explorar Diretório
                    </Button>
                 </Link>
              </CardContent>
           </Card>
        </div>

        {/* Profile card */}
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <h2 className="text-lg font-semibold">Meu perfil</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nome</span>
              <span className="font-medium">{profile.full_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">WhatsApp</span>
              <span className="font-medium">{profile.phone || "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cidade</span>
              <span className="font-medium">
                {profile.city}, {profile.state}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bairro</span>
              <span className="font-medium">{profile.neighborhood || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="secondary" className="text-xs">
                <User className="mr-1 h-3 w-3" />
                Cliente
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
