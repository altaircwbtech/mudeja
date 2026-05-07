import Link from "next/link";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
              M
            </div>
            <span className="text-xl font-bold tracking-tight">
              Mude<span className="text-primary">Já</span>
            </span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/como-funciona"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Como funciona
            </Link>
            <Link
              href="/para-prestadores"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Para prestadores
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="sm" className="shadow-md shadow-primary/20">
                Cadastrar grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
        <div className="absolute top-20 right-[-20%] h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-[-10%] h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

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
              Mudanças e fretes com{" "}
              <span className="bg-gradient-to-r from-primary to-teal-400 bg-clip-text text-transparent">
                quem você confia
              </span>
            </h1>

            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              Encontre prestadores verificados perto de você. Compare avaliações
              reais, receba propostas e contrate com segurança.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/cadastro">
                <Button
                  size="lg"
                  className="h-13 w-full gap-2 px-8 text-base font-semibold shadow-lg shadow-primary/25 sm:w-auto"
                >
                  <Search className="h-5 w-5" />
                  Encontrar prestadores
                </Button>
              </Link>
              <Link href="/para-prestadores">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 w-full gap-2 px-8 text-base sm:w-auto"
                >
                  Sou prestador
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>
                  <strong className="text-foreground">50+</strong> prestadores
                  verificados
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
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
              O que você precisa?
            </h2>
            <p className="text-muted-foreground">
              Conectamos você ao prestador ideal para cada tipo de serviço.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Truck,
                title: "Mudança Residencial",
                desc: "Casa, apartamento, kitnet. De poucos itens a mudanças completas.",
                badge: "Mais popular",
              },
              {
                icon: Package,
                title: "Carreto",
                desc: "Transporte de itens específicos: sofá, geladeira, máquina de lavar.",
                badge: null,
              },
              {
                icon: Truck,
                title: "Frete",
                desc: "Frete de mercadorias, materiais e cargas em geral.",
                badge: null,
              },
            ].map((service) => (
              <Card
                key={service.title}
                className="group relative overflow-hidden border-none bg-card shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-start justify-between">
                    <h3 className="mb-2 text-lg font-semibold">{service.title}</h3>
                    {service.badge && (
                      <Badge variant="secondary" className="text-xs">
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
              Simples, rápido e seguro. Em 3 passos você encontra o prestador
              ideal.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Publique seu pedido",
                desc: "Descreva o que precisa transportar, de onde e para onde. Leva menos de 2 minutos.",
                icon: MessageCircle,
              },
              {
                step: "2",
                title: "Receba propostas",
                desc: "Prestadores verificados da sua região enviam propostas com preço e disponibilidade.",
                icon: TrendingUp,
              },
              {
                step: "3",
                title: "Escolha e contrate",
                desc: "Compare avaliações, preços e perfis. Combine os detalhes direto pelo WhatsApp.",
                icon: CheckCircle2,
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
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
              Confiança em primeiro lugar
            </h2>
            <p className="text-muted-foreground">
              Cada prestador passa por verificações para garantir sua segurança.
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
                desc: "Somente de serviços realizados",
              },
              {
                icon: CheckCircle2,
                title: "Perfil completo",
                desc: "Fotos, veículo e experiência",
              },
              {
                icon: MessageCircle,
                title: "WhatsApp verificado",
                desc: "Contato direto e seguro",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm"
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
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-teal-600 p-8 md:p-14 text-white">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
            <div className="relative max-w-lg">
              <h2 className="mb-4 text-3xl font-bold">
                É prestador de mudanças?
              </h2>
              <p className="mb-6 text-white/80">
                Cadastre-se gratuitamente e receba oportunidades de trabalho na
                sua região. Construa sua reputação e cresça seu negócio.
              </p>
              <Link href="/cadastro">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 font-semibold"
                >
                  Cadastrar como prestador
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
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                M
              </div>
              <span className="font-bold">
                Mude<span className="text-primary">Já</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <Link href="/como-funciona" className="hover:text-foreground transition-colors">
                Como funciona
              </Link>
              <Link href="/para-prestadores" className="hover:text-foreground transition-colors">
                Para prestadores
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
            © {new Date().getFullYear()} MudeJá. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
