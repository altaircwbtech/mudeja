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
  Home,
  Building2,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/Logo";

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

  // Fetch the request details with items
  const { data: request, error } = await supabase
    .from("service_requests")
    .select(`
      *,
      request_items (*)
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !request) {
    return redirect("/cliente");
  }

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
          <h1 className="text-lg font-semibold">Detalhes da Solicitação</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl p-4 md:p-6 mt-4">
        {/* Status & Action Bar */}
        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status Atual</p>
              <p className="font-bold text-slate-900">{request.status === 'published' || request.status === 'receiving_proposals' ? 'Buscando Profissionais' : 'Em andamento'}</p>
            </div>
          </div>
          <Link href={`/cliente/solicitacao/${id}/propostas`}>
            <Button className="font-bold gap-2">
              Ver Propostas <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl overflow-hidden shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b bg-slate-50/50">
               <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold">
                    {request.service_type === 'mudanca_residencial' ? 'Mudança Residencial' : 'Frete / Carreto'}
                  </Badge>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Postado em {new Date(request.created_at).toLocaleDateString('pt-BR')}
                  </span>
               </div>
               <CardTitle className="text-2xl font-black text-slate-900 leading-tight">{request.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-8">
              {/* Route Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" /> Endereços e Logística
                </h3>
                
                <div className="grid gap-6 relative pl-6 border-l-2 border-slate-100 ml-2">
                  {/* Origin */}
                  <div className="relative">
                    <div className="absolute -left-[33px] top-1 h-3.5 w-3.5 rounded-full border-[3px] border-primary bg-background shadow-sm" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Origem</p>
                    <p className="font-bold text-slate-800 text-lg">{request.origin_city}, {request.origin_state}</p>
                    <p className="text-sm text-slate-500">{request.origin_neighborhood} - {request.origin_address}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px] bg-slate-100 font-bold flex items-center gap-1">
                        {request.origin_residence_type === 'casa' ? <Home className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                        {request.origin_residence_type === 'casa' ? 'Casa' : `Prédio (${request.origin_floor || 0}º Andar)`}
                      </Badge>
                      {request.origin_has_elevator && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-none text-[10px] font-black">Com Elevador</Badge>
                      )}
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="relative pt-4">
                    <div className="absolute -left-[33px] top-5 h-3.5 w-3.5 rounded-full border-[3px] border-primary bg-primary shadow-sm" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Destino</p>
                    <p className="font-bold text-slate-800 text-lg">{request.destination_city || request.dest_city}, {request.destination_state || request.dest_state}</p>
                    <p className="text-sm text-slate-500">{request.destination_neighborhood || request.dest_neighborhood} - {request.destination_address || request.dest_address}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px] bg-slate-100 font-bold flex items-center gap-1">
                        {request.destination_residence_type === 'casa' ? <Home className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
                        {request.destination_residence_type === 'casa' ? 'Casa' : `Prédio (${request.destination_floor || 0}º Andar)`}
                      </Badge>
                      {request.destination_has_elevator && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-none text-[10px] font-black">Com Elevador</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Tamanho</p>
                  <p className="font-bold text-slate-900 capitalize">{request.move_size || 'Não informado'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Data Desejada</p>
                  <p className="font-bold text-slate-900">{request.preferred_date ? new Date(request.preferred_date).toLocaleDateString('pt-BR') : 'A combinar'}</p>
                </div>
              </div>

              {/* Items Section */}
              {request.request_items && request.request_items.length > 0 && (
                <div className="space-y-4">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" /> Itens da Mudança
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {request.request_items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">📦</span>
                          <span className="text-sm font-bold text-slate-700">{item.name}</span>
                        </div>
                        <Badge variant="secondary" className="font-black">x{item.quantity}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras */}
              {(request.needs_packing || request.needs_disassembly || request.has_heavy_items) && (
                <div className="space-y-4">
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-primary" /> Observações Especiais
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {request.needs_packing && <Badge className="bg-blue-50 text-blue-700 border-none font-bold">Necessita Embalagem</Badge>}
                    {request.needs_disassembly && <Badge className="bg-indigo-50 text-indigo-700 border-none font-bold">Necessita Desmontagem</Badge>}
                    {request.has_heavy_items && <Badge className="bg-rose-50 text-rose-700 border-none font-bold">Itens Pesados</Badge>}
                  </div>
                  {request.description && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-sm text-slate-600 font-medium leading-relaxed">
                      "{request.description}"
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
