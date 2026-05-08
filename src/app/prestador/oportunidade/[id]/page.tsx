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
  Building,
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
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!providerData) {
    return redirect("/onboarding");
  }

  // Fetch the request details
  const { data: request, error } = await supabase
    .from("service_requests")
    .select(`
      *,
      users (full_name, avatar_url)
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
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {request.service_type === 'mudanca_residencial' ? 'Mudança Residencial' : 'Frete'}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
                <CardTitle className="text-xl">{request.title}</CardTitle>
                <div className="text-sm text-muted-foreground mt-2">
                  Cliente: <span className="font-medium text-foreground">{request.users?.full_name || 'Cliente MovaFácil'}</span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Endereços
                  </h3>
                  <div className="grid gap-3 relative before:absolute before:inset-y-3 before:left-2.5 before:w-0.5 before:bg-border pl-6">
                    <div className="relative">
                      <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Origem</p>
                      <p className="font-medium">{request.origin_city}, {request.origin_state}</p>
                      <p className="text-sm text-muted-foreground">{request.origin_address}</p>
                      {request.has_stairs_origin && (
                        <Badge variant="secondary" className="mt-1 text-xs">Com escadas</Badge>
                      )}
                    </div>
                    <div className="relative pt-2">
                      <div className="absolute -left-[27px] top-3 h-3 w-3 rounded-full border-2 border-primary bg-primary" />
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Destino</p>
                      <p className="font-medium">{request.destination_city || request.dest_city}, {request.destination_state || request.dest_state}</p>
                      <p className="text-sm text-muted-foreground">{request.destination_address || request.dest_address}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Tamanho</p>
                    <p className="font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span className="capitalize">{request.move_size || 'Não informado'}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Data Desejada</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {request.preferred_date ? new Date(request.preferred_date).toLocaleDateString('pt-BR') : 'A combinar'}
                    </p>
                  </div>
                </div>

                {request.description && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold mb-2">Detalhes adicionais</h3>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {request.description}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 shadow-md">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-lg">Enviar Proposta</CardTitle>
                <p className="text-sm text-muted-foreground">O cliente receberá sua oferta e decidirá pelo app.</p>
              </CardHeader>
              <CardContent className="pt-6">
                {existingProposal ? (
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-700">Proposta enviada!</h3>
                      <p className="text-2xl font-bold mt-1">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(existingProposal.price)}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Aguarde o retorno do cliente.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form action={submitProposal} className="space-y-4">
                    <input type="hidden" name="request_id" value={id} />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Seu preço (R$)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">R$</span>
                        <input 
                          type="text" 
                          name="amount" 
                          placeholder="0,00" 
                          required 
                          className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mensagem ao cliente</label>
                      <textarea 
                        name="message" 
                        rows={3} 
                        placeholder="Ex: Tenho caminhão baú, mantas para proteger os móveis e ajudante incluso." 
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      ></textarea>
                    </div>

                    <Button type="submit" className="w-full h-11 text-base font-semibold">
                      Enviar Oferta
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Isso consumirá 1 das suas 3 propostas grátis.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card className="bg-muted/30">
              <CardContent className="p-4 flex gap-3 text-sm">
                <Info className="h-5 w-5 text-primary shrink-0" />
                <p className="text-muted-foreground">
                  Seja rápido e ofereça um preço justo. Propostas detalhadas e com preço realista têm <strong>80% mais chance</strong> de serem aceitas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
