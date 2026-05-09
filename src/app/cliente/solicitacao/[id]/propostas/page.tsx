import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Package, 
  Clock, 
  User, 
  ShieldCheck,
  Star,
  MessageSquare,
  Truck,
  CheckCircle2,
  XCircle,
  Zap,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/Logo";
import { acceptProposal, rejectProposal } from "@/lib/proposal-actions";
import { AcceptButton, RejectButton } from "./proposal-actions-client";

export default async function SolicitacaoPropostasPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch the request details with its proposals and provider info
  const { data: request, error } = await supabase
    .from("service_requests")
    .select(`
      *,
      proposals (
        *,
        provider:providers (
          id,
          business_name,
          type,
          trust_score,
          avg_rating,
          total_reviews,
          years_experience,
          user:users (full_name, avatar_url, phone)
        )
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !request) {
    return redirect("/cliente");
  }

  const proposals = request.proposals || [];
  const activeProposals = proposals.filter((p: any) => p.status !== 'rejected');
  const acceptedProposal = proposals.find((p: any) => p.status === 'accepted');

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Premium Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Link href="/cliente">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
            </Link>
            <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />
            <div>
              <h1 className="text-base font-black text-slate-900 leading-none">Propostas Recebidas</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Solicitação #{id.slice(0, 8)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-3 py-1">
                {proposals.length} TOTAL
             </Badge>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8">
        {/* Request Context Bar */}
        <div className="mb-8 overflow-hidden rounded-[24px] bg-slate-900 p-6 text-white shadow-2xl relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-white/10 hover:bg-white/20 text-white border-none text-[10px] font-black tracking-widest px-2 py-0.5">
                  {request.service_type === 'mudanca_residencial' ? 'MUDANÇA RESIDENCIAL' : 'FRETE / CARRETO'}
                </Badge>
                {request.status === 'matched' && (
                  <Badge className="bg-emerald-500 text-white border-none text-[10px] font-black tracking-widest px-2 py-0.5 animate-pulse">
                    FECHADO
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-black tracking-tight">{request.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 font-medium">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {request.origin_city} → {request.destination_city || request.dest_city}</span>
                <span className="flex items-center gap-1.5"><Package className="h-4 w-4 text-primary" /> {request.move_size}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> {request.preferred_date ? new Date(request.preferred_date).toLocaleDateString('pt-BR') : 'A combinar'}</span>
              </div>
            </div>
            
            <Link href={`/cliente/solicitacao/${id}`}>
              <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white rounded-xl font-bold h-11">
                Ver Detalhes do Pedido
              </Button>
            </Link>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900">Compare as Ofertas</h3>
              <p className="text-sm text-slate-500 font-medium">Escolha o profissional que melhor atende suas necessidades.</p>
            </div>
            {activeProposals.length > 1 && (
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Zap className="h-3 w-3 text-amber-500" /> Dica: Veja o Trust Score
              </div>
            )}
          </div>

          {activeProposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-200">
              <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                <Clock className="h-10 w-10 text-slate-300 animate-spin-slow" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Ainda buscando profissionais...</h4>
              <p className="text-slate-500 max-w-sm mt-2 font-medium">
                Sua solicitação foi enviada para os melhores motoristas da região. Você receberá uma notificação assim que houver propostas.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {activeProposals.map((proposal: any) => {
                const isAccepted = proposal.status === 'accepted';
                const provider = proposal.provider;
                const phone = provider?.user?.phone || "";
                const whatsappUrl = phone ? `https://wa.me/55${phone.replace(/\D/g, "")}?text=Olá%20${encodeURIComponent(provider.business_name || provider.user?.full_name)},%20sou%20cliente%20do%20MovaFácil.%20Aceitei%20sua%20proposta%20para%20minha%20mudança!` : "#";

                return (
                  <Card 
                    key={proposal.id} 
                    className={`group overflow-hidden border-2 transition-all duration-300 rounded-[32px] shadow-sm hover:shadow-xl ${isAccepted ? 'border-primary ring-4 ring-primary/10' : 'border-white hover:border-primary/20'}`}
                  >
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-[1fr_280px]">
                        {/* Provider Side */}
                        <div className="p-6 md:p-8 space-y-6">
                          <div className="flex items-start gap-5">
                            <div className="relative">
                              <div className="h-20 w-20 rounded-[24px] bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                                {provider?.user?.avatar_url ? (
                                  <img src={provider.user.avatar_url} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <User className="h-10 w-10 text-slate-400" />
                                )}
                              </div>
                              {provider?.trust_score >= 80 && (
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg border-2 border-white">
                                  <ShieldCheck className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-xl font-black text-slate-900 truncate">
                                  {provider?.business_name || provider?.user?.full_name}
                                </h4>
                                {provider?.is_pro && (
                                  <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[9px] px-2 py-0.5">PRO</Badge>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                                <div className="flex items-center gap-1.5">
                                  <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} className={`h-3 w-3 ${i < Math.floor(provider?.avg_rating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                                    ))}
                                  </div>
                                  <span className="text-xs font-black text-slate-700">{provider?.avg_rating?.toFixed(1) || '0.0'}</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">({provider?.total_reviews || 0} avaliações)</span>
                                </div>
                                <div className="h-1 w-1 rounded-full bg-slate-300 hidden sm:block" />
                                <div className="flex items-center gap-1.5 text-primary">
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                  <span className="text-[10px] font-black uppercase tracking-tight">Trust Score: {provider?.trust_score || 0}%</span>
                                </div>
                                {provider?.years_experience && (
                                  <>
                                    <div className="h-1 w-1 rounded-full bg-slate-300 hidden sm:block" />
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">{provider.years_experience} Anos de Exp.</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Proposal Message */}
                          <div className="relative">
                            <div className="absolute -left-3 top-0 h-full w-1 bg-primary/20 rounded-full" />
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-inner transition-colors">
                              <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                                "{proposal.message || 'Olá! Tenho total disponibilidade para realizar seu serviço com segurança e agilidade.'}"
                              </p>
                            </div>
                          </div>

                          {/* Details Tags */}
                          <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                              <Truck className="h-4 w-4 text-primary" />
                              <span className="text-xs font-bold text-slate-700 capitalize">{proposal.service_mode === 'full' ? 'Serviço Completo' : 'Mão de Obra'}</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm">
                              <Zap className="h-4 w-4 text-amber-500" />
                              <span className="text-xs font-bold text-slate-700">{proposal.team_size} {proposal.team_size === 1 ? 'Profissional' : 'Profissionais'}</span>
                            </div>
                            {proposal.includes_packing && (
                               <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl shadow-sm">
                                 <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                 <span className="text-xs font-bold text-emerald-700">Embalagem</span>
                               </div>
                            )}
                            {proposal.includes_disassembly && (
                               <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl shadow-sm">
                                 <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                 <span className="text-xs font-bold text-blue-700">Montagem</span>
                               </div>
                            )}
                          </div>
                        </div>

                        {/* Price & Action Side */}
                        <div className={`p-8 flex flex-col justify-between text-center transition-colors ${isAccepted ? 'bg-primary/5' : 'bg-slate-50/50 group-hover:bg-primary/5'}`}>
                          <div className="space-y-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Preço Final</p>
                            <div className="relative inline-block">
                              <p className="text-4xl font-black text-slate-900 tracking-tighter">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.price)}
                              </p>
                              <div className="absolute -top-1 -right-4 h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Sem taxas ocultas</p>
                          </div>

                          <div className="space-y-3 mt-8">
                            {isAccepted ? (
                              <>
                                <Link href={whatsappUrl} target="_blank" className="block w-full">
                                  <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/30 gap-3 group/btn">
                                    <MessageSquare className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                                    Falar no WhatsApp
                                  </Button>
                                </Link>
                                <div className="p-3 bg-white border border-primary/20 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black text-primary uppercase">
                                  <Check className="h-3 w-3" /> Proposta Aceita
                                </div>
                              </>
                            ) : (
                              <>
                                <form action={acceptProposal}>
                                  <input type="hidden" name="proposal_id" value={proposal.id} />
                                  <input type="hidden" name="request_id" value={id} />
                                  <AcceptButton disabled={!!acceptedProposal} />
                                </form>
                                
                                <form action={rejectProposal}>
                                  <input type="hidden" name="proposal_id" value={proposal.id} />
                                  <input type="hidden" name="request_id" value={id} />
                                  <RejectButton disabled={!!acceptedProposal} />
                                </form>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Security / Help Footer */}
        <div className="mt-12 p-8 rounded-[32px] bg-emerald-50 border border-emerald-100 flex flex-col md:flex-row items-center gap-6">
          <div className="h-16 w-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-lg font-black text-emerald-900">Sua mudança segura</h4>
            <p className="text-emerald-700/70 text-sm font-medium mt-1">
              No MovaFácil, todos os profissionais passam por verificação. O pagamento é feito diretamente ao motorista após a conclusão do serviço. Recomendamos conferir o Trust Score e as avaliações antes de fechar.
            </p>
          </div>
          <Button variant="ghost" className="text-emerald-700 font-bold hover:bg-emerald-100">
            Dúvidas? Central de Ajuda
          </Button>
        </div>
      </main>
    </div>
  );
}
