import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, XCircle, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function MinhasPropostasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: provider } = await supabase
    .from("providers")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!provider) redirect("/onboarding");

  // Fetch proposals with the related request data
  const { data: proposals } = await supabase
    .from("proposals")
    .select(`
      *,
      request:service_requests (*)
    `)
    .eq("provider_id", provider.id)
    .order("created_at", { ascending: false });

  // Organize proposals by status
  const pendingProposals = proposals?.filter(p => p.status === 'pending') || [];
  const acceptedProposals = proposals?.filter(p => p.status === 'matched') || [];
  const rejectedProposals = proposals?.filter(p => p.status === 'rejected') || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-4xl items-center px-4">
          <Button variant="ghost" size="icon" asChild className="-ml-2 mr-2">
            <Link href="/prestador">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-bold">Minhas Propostas</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        {/* Ganhas */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            Aceitas pelo Cliente ({acceptedProposals.length})
          </h2>
          {acceptedProposals.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Nenhuma proposta ganha ainda.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {acceptedProposals.map((proposal) => (
                <Card key={proposal.id} className="border-green-200 bg-green-50/30">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Ganha</Badge>
                      <span className="font-bold text-lg text-green-700">
                        R$ {Number(proposal.amount).toFixed(2)}
                      </span>
                    </div>
                    <h3 className="font-semibold">{proposal.request?.title}</h3>
                    <div className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {proposal.request?.origin_city} → {proposal.request?.destination_city || proposal.request?.dest_city}
                    </div>
                    <Button asChild className="w-full mt-4 bg-[#25D366] hover:bg-[#1DA851] text-white">
                      <Link href={`/prestador/oportunidade/${proposal.request_id}`}>
                        Falar com o Cliente
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Pendentes */}
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-amber-600">
            <Clock className="h-5 w-5" />
            Aguardando Resposta ({pendingProposals.length})
          </h2>
          {pendingProposals.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">Nenhuma proposta aguardando.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {pendingProposals.map((proposal) => (
                <Card key={proposal.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Aguardando</Badge>
                      <span className="font-bold text-lg">
                        R$ {Number(proposal.amount).toFixed(2)}
                      </span>
                    </div>
                    <h3 className="font-semibold">{proposal.request?.title}</h3>
                    <div className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {proposal.request?.origin_city} → {proposal.request?.destination_city || proposal.request?.dest_city}
                    </div>
                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link href={`/prestador/oportunidade/${proposal.request_id}`}>
                        Ver Oportunidade
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Perdidas */}
        {rejectedProposals.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-slate-500">
              <XCircle className="h-5 w-5" />
              Recusadas ou Perdidas ({rejectedProposals.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {rejectedProposals.map((proposal) => (
                <Card key={proposal.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-slate-500">Perdida</Badge>
                      <span className="font-bold text-lg line-through text-slate-400">
                        R$ {Number(proposal.amount).toFixed(2)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-600">{proposal.request?.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
