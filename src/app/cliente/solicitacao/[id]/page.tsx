import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  Truck,
  Star,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/Logo";
import { acceptProposal } from "@/lib/proposal-actions";

export default async function SolicitacaoDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch the request details
  const { data: request, error } = await supabase
    .from("service_requests")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id) // Ensure the user owns this request
    .single();

  if (error || !request) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Solicitação não encontrada.</p>
        <Link href="/cliente" className="ml-4 text-primary underline">
          Voltar
        </Link>
      </div>
    );
  }

  // Fetch the proposals for this request
  const { data: proposals } = await supabase
    .from("proposals")
    .select(`
      *,
      provider:providers (
        id,
        business_name,
        avg_rating,
        total_reviews,
        user:users!user_id (phone, avatar_url)
      )
    `)
    .eq("request_id", id)
    .order("price", { ascending: true });

  const hasAccepted = request.status === "matched" || request.status === "in_progress" || request.status === "completed";

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/cliente">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Logo size="sm" showText={false} />
          <h1 className="text-lg font-semibold truncate max-w-[200px] md:max-w-md">
            {request.title}
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4 md:p-6 mt-4">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          
          {/* Coluna Esquerda: Resumo da Solicitação */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-semibold">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid gap-3 relative before:absolute before:inset-y-3 before:left-2.5 before:w-0.5 before:bg-border pl-6">
                  <div className="relative">
                    <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Origem</p>
                    <p className="font-medium text-sm">{request.origin_city}, {request.origin_state}</p>
                  </div>
                  <div className="relative pt-2">
                    <div className="absolute -left-[27px] top-3 h-3 w-3 rounded-full border-2 border-primary bg-primary" />
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Destino</p>
                    <p className="font-medium text-sm">{request.destination_city || request.dest_city}, {request.destination_state || request.dest_state}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-4 border-t text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tamanho</p>
                    <p className="font-medium flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5" />
                      <span className="capitalize">{request.move_size || 'Médio'}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Data</p>
                    <p className="font-medium flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {request.preferred_date ? new Date(request.preferred_date).toLocaleDateString('pt-BR') : 'A combinar'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-none shadow-sm">
              <CardContent className="p-4 flex gap-3 text-sm">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                <p className="text-muted-foreground">
                  O pagamento só será negociado <strong>diretamente com o prestador</strong> via WhatsApp.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita: Propostas */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center justify-between">
              Propostas Recebidas
              <Badge variant="secondary" className="text-sm font-normal">
                {proposals?.length || 0}
              </Badge>
            </h2>

            {proposals?.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                  <div className="rounded-full bg-muted p-4 mb-4">
                    <Clock className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-lg font-medium text-foreground">Aguardando propostas</p>
                  <p className="mt-1 max-w-sm">
                    Os motoristas da sua região já foram notificados. Assim que enviarem os valores, aparecerão aqui.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {proposals?.map((proposal) => {
                  const isAccepted = proposal.status === "accepted";
                  const providerName = proposal.provider?.business_name || "Motorista Parceiro";
                  const providerPhone = proposal.provider?.user?.[0]?.phone;
                  const whatsappMsg = encodeURIComponent(
                    `Olá ${providerName}, vi sua proposta de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.price)} no MovaFácil para minha mudança e gostaria de fechar com você!`
                  );

                  return (
                    <Card 
                      key={proposal.id} 
                      className={`overflow-hidden transition-all ${
                        isAccepted 
                          ? "border-green-500 shadow-md ring-1 ring-green-500" 
                          : hasAccepted 
                            ? "opacity-50 grayscale pointer-events-none" 
                            : "hover:border-primary/50 hover:shadow-md"
                      }`}
                    >
                      {isAccepted && (
                        <div className="bg-green-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 text-center flex items-center justify-center gap-2">
                          <CheckCircle2 className="h-4 w-4" /> Proposta Aceita
                        </div>
                      )}
                      <CardContent className="p-5 md:p-6">
                        <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                          
                          {/* Info do Prestador */}
                          <Link href={`/perfil/${proposal.provider?.id}`} className="flex items-start gap-4 flex-1 hover:opacity-80 transition-opacity cursor-pointer group">
                            <div className="h-12 w-12 rounded-full bg-slate-100 border flex items-center justify-center shrink-0 overflow-hidden shadow-sm group-hover:ring-2 group-hover:ring-primary/50 transition-all">
                              {proposal.provider?.user?.[0]?.avatar_url ? (
                                <img src={proposal.provider.user[0].avatar_url} alt={providerName} className="h-full w-full object-cover" />
                              ) : (
                                <Truck className="h-6 w-6 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg leading-none group-hover:text-primary transition-colors">{providerName}</h3>
                              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1 font-medium text-amber-500">
                                  <Star className="h-4 w-4 fill-current" />
                                  {proposal.provider?.avg_rating && proposal.provider.avg_rating > 0 ? proposal.provider.avg_rating : "Novo"}
                                </span>
                                {proposal.provider?.total_reviews > 0 && (
                                  <span>({proposal.provider.total_reviews} {proposal.provider.total_reviews === 1 ? 'avaliação' : 'avaliações'})</span>
                                )}
                              </div>
                              {proposal.message && (
                                <div className="mt-3 text-sm bg-muted/40 p-3 rounded-md italic text-slate-600 border-l-2 border-primary/30">
                                  "{proposal.message}"
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* Preço e Ação */}
                          <div className="flex flex-col md:items-end w-full md:w-auto gap-3 pt-4 md:pt-0 border-t md:border-t-0 mt-4 md:mt-0">
                            <div className="text-left md:text-right">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Valor da Proposta</p>
                              <p className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.price)}
                              </p>
                            </div>

                            {isAccepted ? (
                              <div className="flex flex-col gap-2 w-full min-w-[200px]">
                                <Button asChild className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white h-12 rounded-xl shadow-lg shadow-green-500/20">
                                  <a href={`https://wa.me/55${providerPhone?.replace(/\D/g, '')}?text=${whatsappMsg}`} target="_blank" rel="noopener noreferrer">
                                    Falar no WhatsApp
                                  </a>
                                </Button>
                                
                                {request.status === "completed" ? (
                                  <div className="mt-2 py-2 px-3 bg-green-50 rounded-lg text-center border border-green-100">
                                    <p className="text-xs font-bold text-green-700 flex items-center justify-center gap-1">
                                      <CheckCircle2 className="h-3.5 w-3.5" /> MUDANÇA CONCLUÍDA
                                    </p>
                                  </div>
                                ) : (
                                  <Button asChild variant="outline" className="w-full h-12 border-primary text-primary hover:bg-primary/5 rounded-xl border-2">
                                    <Link href={`/cliente/solicitacao/${id}/avaliar`}>
                                      Concluir e Avaliar
                                    </Link>
                                  </Button>
                                )}
                              </div>
                            ) : !hasAccepted && (
                              <form action={acceptProposal} className="w-full">
                                <input type="hidden" name="proposal_id" value={proposal.id} />
                                <input type="hidden" name="request_id" value={id} />
                                <Button type="submit" className="w-full h-12 rounded-xl shadow-md font-bold text-base transition-all active:scale-95">
                                  Aceitar Oferta
                                </Button>
                              </form>
                            )}
                          </div>

                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
