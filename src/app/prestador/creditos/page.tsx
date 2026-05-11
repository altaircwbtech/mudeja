import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Coins, 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap, 
  ShoppingBag,
  History
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/brand/Logo";
import { ProfileSwitcher } from "@/components/profile-switcher";
import { NotificationBell } from "@/components/notification-bell";

export default async function CreditosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: provider } = await supabase
    .from("providers")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!provider) redirect("/onboarding");

  // Fetch Credits Balance
  const { data: credits } = await supabase
    .from("provider_credits")
    .select("*")
    .eq("provider_id", provider.id)
    .single();

  // Fetch Transactions
  const { data: transactions } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("provider_id", provider.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/prestador" className="hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <ProfileSwitcher isProvider={true} userName={profile.full_name} />
            <NotificationBell />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Meus MovaCredits</h1>
          <p className="text-muted-foreground">Gerencie seu saldo e histórico de uso de leads.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {/* Balance Card */}
          <Card className="md:col-span-1 bg-primary text-white shadow-xl shadow-primary/20 border-none overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Coins className="h-16 w-16" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider opacity-80">Saldo Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-black mb-1">{credits?.balance ?? 0}</div>
              <p className="text-xs opacity-80">Créditos disponíveis para uso</p>
            </CardContent>
          </Card>

          {/* Quick Info Card */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Por que usar créditos?</CardTitle>
              <CardDescription>
                Cada proposta enviada consome 5 créditos. Leads qualificados aumentam suas chances de fechar negócio.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
               <div className="flex flex-col items-center gap-1">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Zap className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold">Rápido</span>
               </div>
               <div className="flex flex-col items-center gap-1">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <History className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold">Histórico</span>
               </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Transactions List */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Extrato Detalhado
            </h2>
            
            <Card>
              <CardContent className="p-0">
                {!transactions || transactions.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    Nenhuma transação encontrada.
                  </div>
                ) : (
                  <div className="divide-y">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {tx.amount > 0 ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(tx.created_at), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                        <div className={`text-sm font-black ${tx.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Shop Placeholder */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Recarregar
            </h2>
            
            <div className="space-y-4">
              {[
                { name: "Iniciante", credits: 50, price: "R$ 49", bestValue: false },
                { name: "Profissional", credits: 150, price: "R$ 129", bestValue: true },
                { name: "Elite", credits: 500, price: "R$ 349", bestValue: false },
              ].map((pkg) => (
                <Card key={pkg.name} className={`relative overflow-hidden transition-all hover:border-primary cursor-pointer ${pkg.bestValue ? 'border-primary ring-1 ring-primary' : ''}`}>
                  {pkg.bestValue && (
                    <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-tighter">
                      Melhor Valor
                    </div>
                  )}
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{pkg.name}</p>
                      <p className="text-xl font-black">{pkg.credits} Créditos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{pkg.price}</p>
                      <Button size="sm" variant="outline" className="h-7 text-[10px] font-bold px-3">Comprar</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-[10px] text-center text-muted-foreground">
              Pagamento processado via Stripe. Os créditos são adicionados instantaneamente.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
