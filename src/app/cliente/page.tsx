import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth-actions";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  ClipboardList,
  Star,
  LogOut,
  User,
  MapPin,
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {profile.full_name}
            </span>
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
            Olá, {profile.full_name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            O que você precisa mover hoje?
          </p>
        </div>

        {/* Quick actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Card className="group cursor-pointer border-2 border-primary/20 bg-primary/5 transition-all hover:border-primary hover:shadow-md">
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

          <Card className="group cursor-pointer transition-all hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
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
        </div>

        {/* Stats */}
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Minha atividade</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: ClipboardList, label: "Solicitações", value: "0" },
              { icon: Star, label: "Avaliações", value: "0" },
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

        {/* Profile card */}
        <Card>
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
