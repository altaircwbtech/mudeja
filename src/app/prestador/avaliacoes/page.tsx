import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function MinhasAvaliacoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: provider } = await supabase
    .from("providers")
    .select("id, avg_rating, total_reviews")
    .eq("user_id", user.id)
    .single();

  if (!provider) redirect("/onboarding");

  // Fetch reviews with reviewer name and request title
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id,
      overall_rating,
      comment,
      created_at,
      reviewer:users!reviewer_id (full_name, avatar_url),
      request:service_requests (title)
    `)
    .eq("reviewed_provider_id", provider.id)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2 mr-2">
            <Link href="/prestador">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-bold">Minhas Avaliações</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* Overview Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Nota Geral</h2>
              <div className="text-4xl font-black mt-1 flex items-baseline gap-2">
                {provider.avg_rating || "—"} 
                <Star className="h-6 w-6 text-amber-500 fill-amber-500 mb-1" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Baseado em {provider.total_reviews} avaliações
              </p>
            </div>
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
              <MessageSquareQuote className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Feedback dos Clientes</h2>
          {!reviews || reviews.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <Star className="mb-4 h-12 w-12 opacity-20" />
                <p>Nenhuma avaliação recebida ainda.</p>
                <p className="text-sm">Feche serviços e encante clientes para ganhar estrelas!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <Card key={review.id} className="overflow-hidden hover:shadow-sm transition-shadow">
                  <div className="border-l-4 border-amber-500">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 w-full">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{review.reviewer?.full_name || "Cliente"}</span>
                              <span className="text-xs text-muted-foreground">• {new Date(review.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                              <span className="font-bold text-amber-700 mr-1">{review.overall_rating}</span>
                              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
                            Serviço: {review.request?.title}
                          </p>

                          {review.comment ? (
                            <p className="text-sm italic bg-muted/40 p-3 rounded-r-lg border-l-2 border-primary/40">
                              "{review.comment}"
                            </p>
                          ) : (
                            <p className="text-sm italic text-muted-foreground">
                              O cliente não deixou um comentário escrito.
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
