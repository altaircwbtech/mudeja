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
  ThumbsUp
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
  const name = provider.business_name || provider.user?.full_name;
  const location = provider.user?.city 
    ? `${provider.user.city}, ${provider.user.state}`
    : "Localização não informada";
    
  const memberSince = provider.user?.created_at 
    ? new Date(provider.user.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : "";

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-4 shadow-sm">
        <Link href="javascript:history.back()">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Logo size="sm" hideText />
        <h1 className="ml-auto text-sm font-medium text-muted-foreground">Perfil do Parceiro</h1>
      </header>

      {/* Capa e Foto de Perfil */}
      <div className="relative bg-primary/10 h-32 md:h-48 w-full">
        {/* Placeholder for Cover Photo if we ever add one */}
        <div className="absolute -bottom-12 left-6 md:left-12 flex items-end">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background bg-slate-100 flex items-center justify-center overflow-hidden shadow-md">
            {provider.user?.avatar_url ? (
              <img src={provider.user.avatar_url} alt={name} className="h-full w-full object-cover" />
            ) : (
              <Truck className="h-10 w-10 md:h-16 md:w-16 text-slate-400" />
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 md:px-12 mt-16 space-y-8">
        
        {/* Informações Principais */}
        <div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                {name}
                {provider.selfie_verified && (
                  <ShieldCheck className="h-6 w-6 text-green-500" title="Identidade Verificada" />
                )}
              </h1>
              <p className="flex items-center gap-1.5 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                {location}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="outline" className="px-3 py-1.5 bg-background">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1.5" />
                <span className="font-bold text-base">{provider.avg_rating || "Novo"}</span>
              </Badge>
              <Badge variant="outline" className="px-3 py-1.5 bg-background text-muted-foreground">
                <span className="font-bold text-foreground mr-1">{provider.total_completed || 0}</span> mudanças
              </Badge>
            </div>
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground">
            Na plataforma desde {memberSince}
          </p>
          
          {provider.bio && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Sobre</h3>
              <p className="text-slate-600 leading-relaxed">
                {provider.bio}
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <Clock className="h-5 w-5 text-muted-foreground mb-2" />
              <p className="text-xl font-bold">{provider.response_rate || 100}%</p>
              <p className="text-xs text-muted-foreground">Taxa de Resposta</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <ThumbsUp className="h-5 w-5 text-muted-foreground mb-2" />
              <p className="text-xl font-bold">{provider.trust_score || "0.0"}</p>
              <p className="text-xs text-muted-foreground">Trust Score</p>
            </CardContent>
          </Card>
          {/* Espaço para mais stats no futuro (ex: pontualidade, etc) */}
        </div>

        {/* Avaliações */}
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
            <MessageSquare className="h-5 w-5" />
            Avaliações dos Clientes ({reviews?.length || 0})
          </h2>

          {!reviews || reviews.length === 0 ? (
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Star className="h-8 w-8 opacity-20 mb-3" />
                <p>Este parceiro ainda não recebeu avaliações.</p>
                <p className="text-sm mt-1">Seja um dos primeiros a contratá-lo e conte-nos como foi!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                          {review.reviewer?.avatar_url ? (
                            <img src={review.reviewer.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center font-bold text-slate-400">
                              {review.reviewer?.full_name?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {review.reviewer?.full_name?.split(" ")[0]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(review.created_at), { addSuffix: true, locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.overall_rating ? "text-amber-500 fill-amber-500" : "text-slate-200 fill-slate-200"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-slate-700 text-sm mt-2 leading-relaxed">
                        "{review.comment}"
                      </p>
                    )}
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
