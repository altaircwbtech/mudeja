import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth-actions";
import {
  Shield,
  Star,
  MapPin,
  Search,
  ChevronRight,
  Truck,
  Package,
  CheckCircle2,
  Users,
  TrendingUp,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo, LogoIcon } from "@/components/brand/Logo";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Try to figure out user role if logged in
  let dashboardPath = "/cliente";
  if (user) {
    const { data: providerInfo } = await supabase.from("providers").select("id").eq("user_id", user.id).single();
    if (providerInfo) {
      dashboardPath = "/prestador";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/">
            <Logo size="md" />
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/como-funciona"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Como funciona
            </Link>
            <Link
              href="/cadastro"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Seja um parceiro
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <form action={signOut}>
                  <Button variant="ghost" size="sm" type="submit">
                    Sair
                  </Button>
                </form>
                <Button size="sm" className="shadow-md shadow-primary/25" asChild>
                  <Link href={dashboardPath}>
                    Meu Painel
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    Entrar
                  </Link>
                </Button>
                <Button size="sm" className="shadow-md shadow-primary/25" asChild>
                  <Link href="/cadastro">
                    Cadastrar grátis
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background — warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-orange-50/50" />
        <div className="absolute top-10 right-[-15%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] h-80 w-80 rounded-full bg-orange-100/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 px-4 py-1.5 text-sm font-medium"
            >
              <MapPin className="h-3.5 w-3.5" />
              Disponível em Curitiba
            </Badge>

            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Sua mudança{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                sem dor de cabeça
              </span>
            </h1>

            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              Conectamos você a motoristas flex e ajudantes de confiança perto
              de você. Compare preços, veja avaliações reais e mude tranquilo.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="h-13 w-full gap-2 px-8 text-base font-semibold shadow-lg shadow-primary/30 sm:w-auto"
                asChild
              >
                <Link href="/cadastro">
                  <Search className="h-5 w-5" />
                  Buscar serviço
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-13 w-full gap-2 px-8 text-base font-semibold sm:w-auto"
                asChild
              >
                <Link href="/cadastro">
                  <Truck className="h-5 w-5" />
                  Seja um motorista
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <LogoIcon size={16} className="text-primary" />
                <span>
                  <strong className="text-foreground">50+</strong> parceiros
                  verificados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                <span>
                  <strong className="text-foreground">4.8</strong> nota média
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>
                  <strong className="text-foreground">100%</strong> verificados
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight">
              O que você precisa mover?
            </h2>
            <p className="text-muted-foreground">
              Motoristas e ajudantes para todo tipo de mudança e frete.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Truck,
                title: "Mudança Completa",
                desc: "Casa, apartamento, kitnet. De poucos itens a mudanças completas com equipe.",
                badge: "Mais popular",
              },
              {
                icon: Package,
                title: "Carreto",
                desc: "Transporte de itens avulsos: sofá, geladeira, máquina de lavar e mais.",
                badge: null,
              },
              {
                icon: Zap,
                title: "Frete Rápido",
                desc: "Frete de mercadorias, materiais de construção e cargas em geral.",
                badge: null,
              },
            ].map((service) => (
              <Card
                key={service.title}
                className="group relative overflow-hidden border-none bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-start justify-between">
                    <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
                    {service.badge && (
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight">
              Como funciona
            </h2>
            <p className="text-muted-foreground">
              Simples, rápido e seguro. Em 3 passos você resolve sua mudança.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Solicite",
                desc: "Conte o que precisa mover, de onde e para onde. Leva menos de 2 minutos.",
                icon: MessageCircle,
              },
              {
                step: "2",
                title: "Receba propostas",
                desc: "Compare preços e avaliações de motoristas e ajudantes da sua região.",
                icon: TrendingUp,
              },
              {
                step: "3",
                title: "Mude tranquilo",
                desc: "Escolha o melhor profissional e combine os detalhes direto pelo WhatsApp.",
                icon: CheckCircle2,
              },
            ].map((item, idx) => (
              <div key={item.step} className="relative text-center">
                {/* Connector line between steps */}
                {idx < 2 && (
                  <div className="absolute top-7 left-[calc(50%+40px)] hidden h-0.5 w-[calc(100%-80px)] bg-gradient-to-r from-primary/30 to-primary/10 md:block" />
                )}
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                  <item.icon className="h-7 w-7" />
                </div>
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                  Passo {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold tracking-tight">
              Profissionais de confiança
            </h2>
            <p className="text-muted-foreground">
              Cada parceiro passa por verificações para garantir sua segurança.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "Identidade verificada",
                desc: "CPF e selfie validados",
              },
              {
                icon: Star,
                title: "Avaliações reais",
                desc: "De clientes que usaram o serviço",
              },
              {
                icon: Truck,
                title: "Veículo verificado",
                desc: "Fotos e dados do veículo",
              },
              {
                icon: MessageCircle,
                title: "WhatsApp direto",
                desc: "Contato verificado e seguro",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for providers */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-orange-500 to-orange-600 p-8 md:p-14 text-white">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute bottom-[-50px] left-[-30px] h-48 w-48 rounded-full bg-white/5 blur-xl" />
            <div className="relative max-w-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <LogoIcon size={28} />
              </div>
              <h2 className="mb-4 text-3xl font-bold">
                Tem veículo? Seja um parceiro!
              </h2>
              <p className="mb-6 text-white/85">
                Cadastre-se gratuitamente e receba oportunidades de trabalho na
                sua região. Construa sua reputação e cresça seu negócio com a
                MovaFácil.
              </p>
              <Link href="/cadastro">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 font-semibold shadow-lg"
                >
                  Cadastrar como parceiro
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Logo size="sm" />
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <Link href="/como-funciona" className="hover:text-foreground transition-colors">
                Como funciona
              </Link>
              <Link href="/para-prestadores" className="hover:text-foreground transition-colors">
                Seja um parceiro
              </Link>
              <Link href="/termos" className="hover:text-foreground transition-colors">
                Termos de uso
              </Link>
              <Link href="/privacidade" className="hover:text-foreground transition-colors">
                Privacidade
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} MovaFácil. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
