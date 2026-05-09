import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  MapPin,
  Star,
  Truck,
  ShieldCheck,
  MessageSquare,
  Clock,
  ThumbsUp,
  Calendar,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/Logo";

export default async function ProviderProfilePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const supabase = await createClient();

  // Fetch provider data with user details
  const { data: provider, error } = await supabase
    .from("providers")
    .select(`
      *,
      user:users!user_id (
        full_name,
        city,
        state,
        avatar_url,
        created_at
      )
    `)
    .eq("id", id)
    .single();

  if (error || !provider) {
    return notFound();
  }

  // Fetch photos
  const { data: photos } = await supabase
    .from("provider_photos")
    .select("*")
    .eq("provider_id", id)
    .order("sort_order", { ascending: true });

  // Fetch service areas
  const { data: areas } = await supabase
    .from("provider_service_areas")
    .select("*")
    .eq("provider_id", id);

  // Fetch vehicles
  const { data: vehicles } = await supabase
    .from("provider_vehicles")
    .select("*")
    .eq("provider_id", id);

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id,
      overall_rating,
      comment,
      created_at,
      reviewer:users!reviewer_id (full_name, avatar_url)
    `)
    .eq("reviewed_provider_id", id)
    .order("created_at", { ascending: false });

  // Fallback data if needed
  const user = provider.user as any;
  const name = provider.business_name || user?.full_name;
  const location = user?.city 
    ? `${user.city}, ${user.state}`
    : "Localização não informada";
    
  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : "";

  const isVerified = provider.selfie_verified && provider.document_verified;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/80 backdrop-blur-md px-4 shadow-sm">
        <Link href="/cliente">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Logo size="sm" showText={false} />
        <h1 className="ml-auto text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Perfil do Parceiro</h1>
      </header>

      {/* Hero / Capa */}
      <div className="relative h-40 md:h-60 w-full overflow-hidden">
        {/* Usamos a primeira foto da galeria como capa se existir */}
        {photos && photos.length > 0 ? (
          <img src={photos[0].url} alt="Capa" className="w-full h-full object-cover brightness-[0.7]" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
        )}
        
        <div className="absolute -bottom-1 left-0 w-full h-24 bg-gradient-to-t from-slate-50/50 to-transparent" />
      </div>

      <main className="mx-auto max-w-4xl px-4 md:px-6 -mt-20 relative z-10 space-y-8">
        
        {/* Card Principal de Perfil */}
        <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:items-end">
              <div className="relative shrink-0">
                <div className="h-28 w-28 md:h-36 md:w-36 rounded-[2rem] border-4 border-background bg-slate-100 flex items-center justify-center overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <Truck className="h-10 w-10 md:h-16 md:w-16 text-slate-400" />
                  )}
                </div>
                {isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-2xl shadow-lg border-4 border-background">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                    {name}
                  </h1>
                  {isVerified && (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1 font-bold flex gap-1">
                      Verificado
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    {location}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Desde {memberSince}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-amber-500/10 text-amber-600 rounded-2xl px-4 py-2 flex flex-col items-center border border-amber-500/20">
                  <span className="text-2xl font-black leading-none">{provider.avg_rating || "5.0"}</span>
                  <div className="flex gap-0.5 mt-1">
                    <Star className="h-3 w-3 fill-current" />
                  </div>
                  <span className="text-[10px] font-bold uppercase mt-1 opacity-60">Avaliação</span>
                </div>

                <div className="bg-primary/10 text-primary rounded-2xl px-4 py-2 flex flex-col items-center border border-primary/20">
                  <span className="text-2xl font-black leading-none">
                    {provider.trust_score ? `${(provider.trust_score * 20).toFixed(0)}%` : "0%"}
                  </span>
                  <div className="flex gap-0.5 mt-1">
                    <ShieldCheck className="h-3 w-3" />
                  </div>
                  <span className="text-[10px] font-bold uppercase mt-1 opacity-60">Confiança</span>
                </div>
              </div>
            </div>

            {provider.bio && (
              <div className="mt-8 pt-8 border-t border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Sobre o Parceiro</h3>
                <p className="text-slate-600 leading-relaxed text-lg italic">
                  "{provider.bio}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Coluna Principal: Galeria e Avaliações */}
          <div className="md:col-span-2 space-y-8">
            
            {/* Galeria de Trabalhos */}
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-primary" />
                Galeria de Trabalhos
              </h2>
              {!photos || photos.length === 0 ? (
                <div className="bg-muted/30 border-2 border-dashed rounded-3xl p-12 text-center text-muted-foreground">
                  <p className="text-sm italic">Nenhuma foto publicada ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {photos.map((photo, i) => (
                    <div 
                      key={photo.id} 
                      className={`relative rounded-3xl overflow-hidden border shadow-sm group cursor-zoom-in ${
                        i === 0 ? "col-span-2 aspect-video" : "aspect-square"
                      }`}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.caption} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {photo.caption && (
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                          <p className="text-white text-xs font-medium">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Avaliações */}
            <section>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                O que dizem os clientes ({reviews?.length || 0})
              </h2>

              {!reviews || reviews.length === 0 ? (
                <Card className="bg-slate-50 border-dashed rounded-[2rem]">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <Star className="h-8 w-8 opacity-20 mb-3" />
                    <p>Este parceiro ainda não recebeu avaliações.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="shadow-sm border-none rounded-2xl bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border">
                              {review.reviewer?.[0]?.avatar_url ? (
                                <img src={review.reviewer[0].avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center font-bold text-slate-300">
                                  {review.reviewer?.[0]?.full_name?.charAt(0) || "U"}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-sm">
                                {review.reviewer?.[0]?.full_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: ptBR })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                            <span className="text-sm font-bold text-amber-700">{review.overall_rating}</span>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-slate-600 text-sm leading-relaxed italic">
                            "{review.comment}"
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Coluna Lateral: Frota e Regiões */}
          <div className="space-y-6">
            
            {/* Frota / Veículos */}
            <Card className="rounded-[2rem] border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Sua Frota
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!vehicles || vehicles.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">Nenhum veículo cadastrado.</p>
                ) : (
                  vehicles.map(v => (
                    <div key={v.id} className="p-3 bg-slate-50 rounded-2xl border flex items-center gap-3">
                      <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border">
                        <Truck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{v.brand} {v.model}</p>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground">{v.type}</p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Regiões Atendidas */}
            <Card className="rounded-[2rem] border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Onde Atende
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {!areas || areas.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Região de cadastro apenas.</p>
                  ) : (
                    areas.map(a => (
                      <Badge key={a.id} variant="secondary" className="rounded-lg py-1">
                        {a.city}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Selo de Confiança */}
            <div className="bg-primary p-6 rounded-[2rem] text-white shadow-xl shadow-primary/20">
              <ShieldCheck className="h-8 w-8 mb-4" />
              <h3 className="font-bold text-lg mb-2">Reserva Segura</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Este parceiro foi verificado pela nossa equipe e segue nossos padrões de qualidade. Combine o pagamento direto via WhatsApp.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
