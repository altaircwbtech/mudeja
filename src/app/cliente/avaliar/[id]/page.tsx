import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Star, Truck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/brand/Logo";
import ReviewFormClient from "./ReviewFormClient";

export default async function AvaliarServicoPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const requestId = params.id;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch the request and matched provider
  const { data: request, error } = await supabase
    .from("service_requests")
    .select(`
      *,
      provider:providers!chosen_provider_id (
        id,
        business_name,
        user:users!user_id (full_name, avatar_url)
      )
    `)
    .eq("id", requestId)
    .eq("user_id", user.id) // Ensure security
    .single();

  if (error || !request || !request.provider) {
    return notFound();
  }

  // Check if already reviewed
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("request_id", requestId)
    .single();

  if (existingReview) {
    redirect("/cliente"); // Already reviewed
  }

  const providerName = request.provider.business_name || request.provider.user?.[0]?.full_name;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <header className="sticky top-0 z-50 flex h-16 items-center border-b bg-background/80 backdrop-blur-md px-4">
        <Link href="/cliente">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Logo size="sm" showText={false} />
        <h1 className="ml-auto text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Avaliação do Serviço</h1>
      </header>

      <main className="mx-auto max-w-xl px-4 py-12">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Como foi seu carreto?</h2>
          <p className="text-slate-500">Sua avaliação ajuda o profissional e a comunidade.</p>
        </div>

        {/* Profissional Card */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="h-24 w-24 rounded-3xl bg-white shadow-xl border-4 border-white overflow-hidden flex items-center justify-center">
              {request.provider.user?.[0]?.avatar_url ? (
                <img src={request.provider.user[0].avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <Truck className="h-10 w-10 text-slate-300" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-xl shadow-lg border-4 border-slate-50">
               <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900">{providerName}</h3>
          <p className="text-sm text-slate-500 font-medium italic">"{request.title}"</p>
        </div>

        <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2rem] overflow-hidden">
          <CardContent className="p-8">
             <ReviewFormClient 
                requestId={requestId} 
                providerId={request.provider.id} 
                providerName={providerName}
             />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
