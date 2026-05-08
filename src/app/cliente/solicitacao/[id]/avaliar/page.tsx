import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Star, MessageSquare, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReviewFormClient from "./ReviewFormClient";

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch the request and the chosen provider
  const { data: request } = await supabase
    .from("service_requests")
    .select(`
      *,
      chosen_provider:providers(
        id,
        business_name,
        users(full_name, avatar_url)
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!request) notFound();

  // If already completed or no provider chosen, redirect
  if (request.status === "completed") {
    redirect(`/cliente/solicitacao/${id}?success=already_reviewed`);
  }

  if (!request.chosen_provider_id) {
    redirect(`/cliente/solicitacao/${id}`);
  }

  const provider = request.chosen_provider;
  const providerName = provider?.business_name || (provider as any)?.users?.full_name || "Prestador";
  const providerAvatar = (provider as any)?.users?.avatar_url;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background px-4 shadow-sm">
        <Link href={`/cliente/solicitacao/${id}`}>
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold">Avaliar Serviço</h1>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-600 shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Como foi a mudança?</h2>
          <p className="text-muted-foreground mt-2"> Sua avaliação ajuda a manter a qualidade e segurança no MovaFácil.</p>
        </div>

        <Card className="border-none shadow-xl shadow-primary/5 bg-white overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b pb-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                {providerAvatar ? (
                  <img src={providerAvatar} alt={providerName} className="h-full w-full object-cover" />
                ) : (
                  <Star className="h-6 w-6 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">{providerName}</CardTitle>
                <p className="text-xs text-muted-foreground">Prestador escolhido para seu pedido</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <ReviewFormClient 
              requestId={id} 
              providerId={request.chosen_provider_id} 
            />
          </CardContent>
        </Card>

        <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                  <Star className="h-4 w-4 text-slate-300" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground max-w-[280px]">
              Ao enviar sua avaliação, o pedido será marcado como concluído automaticamente.
            </p>
        </div>
      </main>
    </div>
  );
}
