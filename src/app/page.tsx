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
  Clock,
  ThumbsUp,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo, LogoIcon } from "@/components/brand/Logo";
import HeroSearchClient from "./HeroSearchClient";

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
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Logo size="md" />
          </Link>
          
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/explorar" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
              <Search className="h-4 w-4" /> Explorar Profissionais
            </Link>
            <Link href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Como funciona
            </Link>
            <Link href="/cadastro" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Seja um parceiro
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <form action={signOut}>
                  <Button variant="ghost" size="sm" type="submit" className="hidden sm:inline-flex">
                    Sair
                  </Button>
                </form>
                <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" asChild>
                  <Link href={dashboardPath}>
                    Meu Painel
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" asChild>
                  <Link href="/cadastro">Começar agora</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 -mr-20 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 h-[400px] w-[400px] rounded-full bg-orange-100/20 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Text Content */}
              <div className="animate-fade-in-up">
                <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-semibold tracking-wide text-primary border-primary/20 bg-primary/5">
                  <MapPin className="mr-1.5 h-3.5 w-3.5" />
                  Mude com tranquilidade em Curitiba
                </Badge>
                
                <h1 className="mb-6 text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.1]">
                  Sua mudança com{" "}
                  <span className="relative inline-block text-primary">
                    segurança real
                    <svg className="absolute -bottom-2 left-0 h-3 w-full text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                  </span>
                  {" "}e preço justo
                </h1>

                <p className="mb-10 text-lg leading-relaxed text-muted-foreground md:text-xl max-w-xl">
                  Encontre motoristas verificados por nossa auditoria humana. Compare orçamentos, veja o <strong>Trust Score</strong> e feche sua mudança em minutos.
                </p>

                <HeroSearchClient />

                <p className="mt-4 px-6 text-xs text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-500" />
                  Auditoria humana de documentos ativa para 100% dos parceiros.
                </p>

                <div className="mt-12 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} 
                          alt="User" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold">4.9/5</span>
                    </div>
                    <p className="text-muted-foreground">Baseado em +1.200 mudanças</p>
                  </div>
                </div>
              </div>

              {/* Hero Image / Visual */}
              <div className="relative animate-float lg:ml-auto">
                <div className="relative z-10 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-border/50">
                  <img 
                    src="/movafacil_hero_premium.png" 
                    alt="Mudança MovaFácil" 
                    className="aspect-video w-full object-cover md:aspect-square lg:h-[550px]"
                  />
                  {/* Floating Cards over image */}
                  <div className="absolute top-6 left-6 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md dark:bg-black/80">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</p>
                        <p className="text-sm font-bold">Motorista Verificado</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 rounded-2xl bg-white/90 p-4 shadow-xl backdrop-blur-md dark:bg-black/80">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Economia</p>
                        <p className="text-sm font-bold">Até 30% mais barato</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 -z-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 -z-10 h-40 w-40 rounded-full bg-orange-400/20 blur-3xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-muted/50 py-24" id="servicos">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-black tracking-tight sm:text-4xl">Tudo que você precisa em um só lugar</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Da pequena entrega à mudança completa, temos o parceiro ideal para o seu perfil.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Preço Justo",
                  desc: "Receba múltiplos orçamentos e escolha o que cabe no seu bolso sem taxas escondidas.",
                  icon: TrendingUp,
                  color: "text-blue-500",
                  bg: "bg-blue-50"
                },
                {
                  title: "Segurança Total",
                  desc: "Todos os parceiros são verificados rigorosamente antes de entrar na plataforma.",
                  icon: Shield,
                  color: "text-green-500",
                  bg: "bg-green-50"
                },
                {
                  title: "Agilidade",
                  desc: "Precisa mudar hoje? Encontre motoristas disponíveis agora mesmo na sua região.",
                  icon: Zap,
                  color: "text-orange-500",
                  bg: "bg-orange-50"
                },
                {
                  title: "Comunicação Direta",
                  desc: "Combine detalhes, envie fotos e tire dúvidas direto pelo WhatsApp com o profissional.",
                  icon: MessageCircle,
                  color: "text-purple-500",
                  bg: "bg-purple-50"
                },
                {
                  title: "Flexibilidade",
                  desc: "Veículos de todos os tamanhos: de picapes para pequenos fretes a caminhões baú.",
                  icon: Truck,
                  color: "text-amber-500",
                  bg: "bg-amber-50"
                },
                {
                  title: "Apoio ao Cliente",
                  desc: "Nossa equipe está sempre pronta para ajudar caso você tenha qualquer problema.",
                  icon: ThumbsUp,
                  color: "text-rose-500",
                  bg: "bg-rose-50"
                }
              ].map((feature, i) => (
                <div key={i} className="group relative rounded-3xl border bg-card p-8 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} ${feature.color} transition-colors group-hover:bg-primary group-hover:text-white`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works - Steps */}
        <section className="py-24" id="como-funciona">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="mb-8 text-3xl font-black tracking-tight sm:text-4xl">Mudar nunca foi tão simples</h2>
                <div className="space-y-12">
                  {[
                    {
                      step: "01",
                      title: "Peça seu orçamento",
                      desc: "Diga-nos o que você precisa mover, a data e o local. Leva menos de 1 minuto.",
                      icon: Smartphone
                    },
                    {
                      step: "02",
                      title: "Compare as ofertas",
                      desc: "Receba propostas de motoristas verificados. Veja o perfil e as avaliações de cada um.",
                      icon: Users
                    },
                    {
                      step: "03",
                      title: "Feche o negócio",
                      desc: "Escolha a melhor proposta e combine os detalhes finais diretamente via WhatsApp.",
                      icon: CheckCircle2
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-white shadow-lg shadow-primary/20">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                        <p className="text-lg text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button size="lg" className="mt-12 h-14 px-10 text-lg font-bold" asChild>
                  <Link href="/cadastro">Criar Solicitação Grátis</Link>
                </Button>
              </div>

              <div className="relative animate-float">
                <div className="aspect-square rounded-[40px] bg-gradient-to-tr from-primary/20 to-orange-300/20 p-1 shadow-2xl">
                  <div className="h-full w-full rounded-[38px] bg-white p-8 dark:bg-zinc-900 border border-white/20">
                    {/* Mock dashboard UI */}
                    <div className="space-y-6">
                      <div className="h-8 w-1/2 rounded-full bg-muted/50" />
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-24 rounded-2xl bg-primary/10 flex flex-col items-center justify-center p-2 border border-primary/5">
                          <div className="h-1.5 w-8 rounded-full bg-primary/40 mb-2" />
                          <div className="h-3 w-12 rounded-full bg-primary/20" />
                        </div>
                        <div className="h-24 rounded-2xl bg-muted/30" />
                        <div className="h-24 rounded-2xl bg-muted/30" />
                      </div>
                      <div className="space-y-4">
                        {[
                          { name: "Carlos Silva", price: "R$ 480", rating: "4.9", color: "bg-blue-400" },
                          { name: "Marcos Frete", price: "R$ 520", rating: "5.0", color: "bg-emerald-400" },
                          { name: "João Mudanças", price: "R$ 450", rating: "4.8", color: "bg-orange-400" }
                        ].map((driver, i) => (
                          <div 
                            key={i} 
                            className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm relative overflow-hidden group transition-all hover:border-primary/30"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-shimmer" />
                            <div className={`h-10 w-10 rounded-full ${driver.color} flex items-center justify-center text-white font-bold text-xs`}>
                              {driver.name.charAt(0)}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[13px] font-bold">{driver.name}</span>
                                <span className="text-[13px] font-black text-primary">{driver.price}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="h-1.5 w-24 rounded-full bg-muted" />
                                <span className="text-[10px] text-muted-foreground ml-auto">⭐ {driver.rating}</span>
                              </div>
                            </div>
                            <div className="h-8 w-16 rounded-lg bg-primary/10 border border-primary/20" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -right-8 bottom-12 hidden h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-2xl dark:bg-zinc-800 md:flex border border-border/50 animate-bounce-slow">
                  <Clock className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -left-8 top-12 hidden h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-2xl md:flex border border-primary animate-float">
                  <ShieldCheck className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[40px] bg-zinc-900 px-8 py-20 text-center text-white shadow-2xl md:px-16">
              {/* Background patterns */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl" />

              <div className="relative z-10 mx-auto max-w-3xl">
                <LogoIcon size={64} className="mx-auto mb-8 text-primary" />
                <h2 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl">Pronto para sua nova fase?</h2>
                <p className="mb-12 text-xl text-zinc-400">
                  Junte-se a milhares de pessoas que mudaram com segurança e economia usando a MovaFácil.
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button size="lg" className="h-16 px-12 text-xl font-black animate-shimmer relative overflow-hidden" asChild>
                    <Link href="/cadastro">Começar Agora</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="h-16 border-zinc-700 bg-transparent px-12 text-xl font-black text-white hover:bg-zinc-800" asChild>
                    <Link href="/cadastro">Ver Preços</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="col-span-2 space-y-6">
              <Logo size="md" />
              <p className="max-w-sm text-lg text-muted-foreground">
                A plataforma que simplifica sua mudança conectando você aos melhores profissionais de Curitiba e região.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    <span className="sr-only">Social</span>
                    <Smartphone className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="mb-6 font-bold uppercase tracking-wider text-muted-foreground">Plataforma</h4>
              <ul className="space-y-4 font-medium">
                <li><Link href="#como-funciona" className="hover:text-primary transition-colors">Como funciona</Link></li>
                <li><Link href="#servicos" className="hover:text-primary transition-colors">Serviços</Link></li>
                <li><Link href="/cadastro" className="hover:text-primary transition-colors">Cadastrar</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-6 font-bold uppercase tracking-wider text-muted-foreground">Empresa</h4>
              <ul className="space-y-4 font-medium">
                <li><Link href="/termos" className="hover:text-primary transition-colors">Termos de uso</Link></li>
                <li><Link href="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link></li>
                <li><Link href="/contato" className="hover:text-primary transition-colors">Contato</Link></li>
                <li><Link href="/ajuda" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} MovaFácil. Feito com ❤️ para facilitar sua vida.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
