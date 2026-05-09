import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  MapPin,
  Calendar,
  Package,
  ArrowLeft,
  Info,
  Clock,
  ShieldCheck,
  Home,
  Building2,
  Users2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/Logo";
import { submitProposal } from "@/lib/proposal-actions";

export default async function OportunidadeDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Get provider info
  const { data: providerData } = await supabase
    .from("providers")
    .select("id, type")
    .eq("user_id", user.id)
    .single();

  if (!providerData) {
    return redirect("/onboarding");
  }

  const isHelper = providerData.type === "helper";

  // Fetch the request details
  const { data: request, error } = await supabase
    .from("service_requests")
    .select(`
      *,
      users (full_name, avatar_url),
      request_items (*)
    `)
    .eq("id", id)
    .single();

  if (error || !request) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Solicitação não encontrada ou não está mais disponível.</p>
        <Link href="/prestador" className="ml-4 text-primary underline">
          Voltar
        </Link>
      </div>
    );
  }

  // Check if provider already sent a proposal
  const { data: existingProposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("request_id", id)
    .eq("provider_id", providerData.id)
    .single();

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/prestador">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Logo size="sm" showText={false} />
          <h1 className="text-lg font-semibold">Detalhes do Serviço</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4 md:p-6 mt-4">
        {isHelper && (
          <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3 text-blue-700 shadow-sm animate-in fade-in slide-in-from-top-2">
            <Info className="h-5 w-5 shrink-0" />
            <div className="text-sm">
              <p className="font-bold">Aviso para Ajudante Profissional</p>
              <p className="opacity-90">Lembre-se: Você está se candidatando como <strong>mão de obra</strong>. Certifique-se de combinar com o cliente se ele já possui o transporte ou se você fará parte de uma equipe.</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card className="rounded-2xl overflow-hidden shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 font-bold">
                    {request.service_type === 'mudanca_residencial' ? 'Mudança Residencial' : 'Frete'}
                  </Badge>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <CardTitle className="text-2xl font-black text-slate-900 leading-tight">{request.title}</CardTitle>
                <div className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  Cliente: <span className="font-bold text-slate-700">{request.users?.full_name || 'Cliente MovaFácil'}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Rota do Serviço
                  </h3>
                  <div className="grid gap-4 relative pl-6 border-l-2 border-slate-100 ml-2">
                    {/* Origin */}
                    <div className="relative">
                      <div className="absolute -left-[33px] top-1 h-3.5 w-3.5 rounded-full border-[3px] border-primary bg-background shadow-sm" />
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Origem</p>
                      <p className="font-bold text-slate-800">{request.origin_city}, {request.origin_state}</p>
                      <p className="text-xs text-slate-500">{request.origin_neighborhood}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px] bg-slate-100 font-bold flex items-center gap-1">
                          {request.origin_residence_type === 'casa' ? <Home className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                          {request.origin_residence_type === 'casa' ? 'Casa' : `Prédio (${request.origin_floor || 0}º Andar)`}
                        </Badge>
                        {request.origin_residence_type === 'apartamento' && (
                          <Badge variant="secondary" className={`text-[10px] font-bold ${request.origin_has_elevator ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {request.origin_has_elevator ? 'Com Elevador' : 'Sem Elevador (Escada)'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="relative pt-4">
                      <div className="absolute -left-[33px] top-5 h-3.5 w-3.5 rounded-full border-[3px] border-primary bg-primary shadow-sm" />
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Destino</p>
                      <p className="font-bold text-slate-800">{request.destination_city || request.dest_city}, {request.destination_state || request.dest_state}</p>
                      <p className="text-xs text-slate-500">{request.destination_neighborhood || request.dest_neighborhood}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="text-[10px] bg-slate-100 font-bold flex items-center gap-1">
                          {request.destination_residence_type === 'casa' ? <Home className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                          {request.destination_residence_type === 'casa' ? 'Casa' : `Prédio (${request.destination_floor || 0}º Andar)`}
                        </Badge>
                        {request.destination_residence_type === 'apartamento' && (
                          <Badge variant="secondary" className={`text-[10px] font-bold ${request.destination_has_elevator ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {request.destination_has_elevator ? 'Com Elevador' : 'Sem Elevador (Escada)'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Logística Principal</p>
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 capitalize">{request.move_size || 'Tamanho não informado'}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Volume estimado de itens</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Data do Serviço</p>
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {request.desired_date ? new Date(request.desired_date).toLocaleDateString('pt-BR') : 'A combinar'}
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        {request.is_date_flexible ? '📅 Cliente tem flexibilidade' : '📌 Data exata'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cliente Helpers Info */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Users2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Ajudantes do Cliente</p>
                      <p className="text-[10px] text-slate-500">Pessoas que estarão no local para ajudar.</p>
                    </div>
                  </div>
                  <Badge className={`font-black ${request.client_has_helpers ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {request.client_has_helpers ? `+ ${request.client_helpers_count} pessoas` : 'Nenhum'}
                  </Badge>
                </div>

                {request.request_items && request.request_items.length > 0 && (
                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                      Inventário Detalhado
                      <Badge variant="outline" className="text-[10px] bg-slate-50 border-slate-200">
                        {request.request_items.length} Tipos de Itens
                      </Badge>
                    </h3>
                    <div className="grid gap-2">
                      {request.request_items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-primary/20 transition-all">
                          <div className="h-10 w-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                            {item.name === 'Geladeira' && '❄️'}
                            {item.name === 'Fogão' && '🔥'}
                            {item.name === 'Máquina de Lavar' && '🧺'}
                            {item.name === 'Sofá' && '🛋️'}
                            {item.name === 'Cama Casal' && '🛏️'}
                            {item.name === 'Mesa de Jantar' && '🍽️'}
                            {item.name === 'Guarda-roupa' && '👗'}
                            {item.name === 'Caixas de Mudança' && '📦'}
                            {item.name === 'Televisão' && '📺'}
                            {!['Geladeira', 'Fogão', 'Máquina de Lavar', 'Sofá', 'Cama Casal', 'Mesa de Jantar', 'Guarda-roupa', 'Caixas de Mudança', 'Televisão'].includes(item.name) && '📦'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                               <p className="font-bold text-slate-900">{item.name}</p>
                               <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">x{item.quantity}</span>
                            </div>
                            <div className="flex gap-2 mt-1">
                               {item.is_fragile && (
                                 <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[9px] px-1.5 h-4 font-black uppercase tracking-tighter">Frágil</Badge>
                               )}
                               {item.needs_disassembly && (
                                 <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[9px] px-1.5 h-4 font-black uppercase tracking-tighter">Desmontagem</Badge>
                               )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {request.description && (
                  <div className="pt-6 border-t border-slate-100">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Observações Extras</h3>
                    <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100 leading-relaxed font-medium italic">
                      "{request.description}"
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 shadow-xl rounded-[24px] overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                <CardTitle className="text-lg font-black text-primary">Enviar Proposta</CardTitle>
                <p className="text-xs text-slate-500 font-medium">Sua oferta chegará instantaneamente ao cliente.</p>
              </CardHeader>
              <CardContent className="pt-6">
                {existingProposal ? (
                  <div className="text-center space-y-4 py-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center animate-bounce">
                      <ShieldCheck className="h-8 w-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-black text-emerald-700 text-lg uppercase tracking-tight">Proposta Enviada!</h3>
                      <p className="text-3xl font-black text-slate-900 mt-1">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(existingProposal.price)}
                      </p>
                      <p className="text-xs text-slate-400 mt-4 font-bold uppercase tracking-widest bg-slate-50 py-2 rounded-full">
                        Aguardando Cliente...
                      </p>
                    </div>
                  </div>
                ) : (
                  <form action={submitProposal} className="space-y-5">
                    <input type="hidden" name="request_id" value={id} />
                    
                    <div className="space-y-6">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Como você quer atender?</label>
                      
                      <div className="space-y-3">
                        {/* Option 1: Full Service */}
                        <div className="relative">
                          <label className={`
                            group relative flex flex-col p-4 rounded-2xl border-2 transition-all hover:border-primary/50
                            ${!isHelper ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 bg-white'}
                          `}>
                            <input type="radio" name="service_mode" value="full" defaultChecked={!isHelper} className="sr-only" />
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-black text-slate-900 text-sm">Serviço Completo</p>
                                <p className="text-[10px] text-slate-500 font-medium">Caminhão + Equipe + Logística</p>
                              </div>
                              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">🚚</div>
                            </div>
                            
                            {/* Team Size nested selection */}
                            {!isHelper && (
                              <div className="pt-3 border-t border-primary/10 space-y-2">
                                <p className="text-[9px] font-black text-primary/70 uppercase tracking-wider">Quantas pessoas na equipe?</p>
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    { val: 1, label: 'Só eu' },
                                    { val: 2, label: '+1 Ajudante' },
                                    { val: 3, label: '+2 ou mais' },
                                  ].map((team) => (
                                    <label key={team.val} className="relative">
                                      <input type="radio" name="team_size" value={team.val} defaultChecked={team.val === 2} className="sr-only peer" />
                                      <div className="flex items-center justify-center min-h-[52px] text-[11px] font-black text-center p-2 rounded-2xl border-2 border-slate-100 peer-checked:border-primary peer-checked:bg-white peer-checked:text-primary transition-all cursor-pointer hover:bg-slate-50 leading-tight">
                                        {team.label}
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            )}
                          </label>
                        </div>

                        {/* Option 2: Labor Only */}
                        <div className="relative">
                          <label className={`
                            group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all hover:border-primary/50
                            ${isHelper ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-100 bg-white'}
                          `}>
                            <input type="radio" name="service_mode" value="labor" defaultChecked={isHelper} className="sr-only" />
                            <div>
                              <p className="font-black text-slate-900 text-sm">Apenas Mão de Obra</p>
                              <p className="text-[10px] text-slate-500 font-medium">Vou apenas para ajudar/carregar.</p>
                            </div>
                            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl">🤝</div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Seu preço total (R$)</label>
                      <div className="relative group">
                        <span className="absolute left-4 top-3 text-lg font-bold text-slate-400 group-focus-within:text-primary transition-colors">R$</span>
                        <input 
                          type="text" 
                          name="amount" 
                          placeholder="0,00" 
                          required 
                          className="flex h-14 w-full rounded-2xl border-2 border-slate-100 bg-background pl-12 pr-4 py-2 text-lg font-bold ring-offset-background placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Sua Mensagem</label>
                      <textarea 
                        name="message" 
                        rows={4} 
                        placeholder={isHelper ? "Ex: Tenho experiência em montagem de móveis, trago minhas ferramentas e posso ajudar na embalagem." : "Ex: Tenho caminhão baú de 5 metros, mantas para proteção e 2 ajudantes inclusos."} 
                        className="flex w-full rounded-2xl border-2 border-slate-100 bg-background px-4 py-3 text-sm font-medium ring-offset-background placeholder:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all resize-none"
                      ></textarea>
                    </div>

                    <Button type="submit" className="w-full h-14 text-lg font-black shadow-xl shadow-primary/20 rounded-2xl">
                      Enviar Proposta
                    </Button>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      Gasta 1 de 3 propostas grátis
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-900 text-white rounded-[24px] overflow-hidden border-none">
              <CardContent className="p-5 flex gap-3 text-sm">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <p className="font-bold text-white mb-1 uppercase text-xs tracking-wider">Dica de Especialista</p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Seja honesto no preço. Propostas com valores realistas e descrições detalhadas têm <strong>8x mais chance</strong> de fechar o negócio.
                    </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
