import { createClient } from "@/lib/supabase/server";
import { 
  Users, 
  Truck, 
  ShieldAlert, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch Stats
  const { count: totalProviders } = await supabase
    .from("providers")
    .select("*", { count: "exact", head: true });

  const { count: pendingVerifications } = await supabase
    .from("providers")
    .select("*", { count: "exact", head: true })
    .eq("document_verified", false);

  const { count: activeRequests } = await supabase
    .from("service_requests")
    .select("*", { count: "exact", head: true })
    .in("status", ["published", "receiving_proposals", "matched", "in_progress"]);

  // Recent Providers
  const { data: recentProviders } = await supabase
    .from("providers")
    .select("*, users(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Total de Prestadores",
      value: totalProviders || 0,
      icon: Truck,
      color: "text-blue-600",
      bg: "bg-blue-100",
      description: "Motoristas cadastrados"
    },
    {
      title: "Aguardando Validação",
      value: pendingVerifications || 0,
      icon: ShieldAlert,
      color: "text-amber-600",
      bg: "bg-amber-100",
      description: "Documentos pendentes"
    },
    {
      title: "Serviços em Aberto",
      value: activeRequests || 0,
      icon: Clock,
      color: "text-green-600",
      bg: "bg-green-100",
      description: "Mudanças em andamento"
    },
    {
      title: "Taxa de Sucesso",
      value: "94%",
      icon: CheckCircle2,
      color: "text-purple-600",
      bg: "bg-purple-100",
      description: "Matches concluídos"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Visão Geral</h2>
        <p className="text-slate-500">Bem-vindo ao centro de operações do MovaFácil.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-900">{stat.value}</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Providers */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Novos Prestadores</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              Ver todos <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentProviders?.map((provider: any) => (
                <div key={provider.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {provider.users?.full_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{provider.business_name || provider.users?.full_name}</p>
                      <p className="text-xs text-slate-500">{provider.users?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      provider.document_verified 
                        ? "bg-green-100 text-green-700" 
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {provider.document_verified ? "Verificado" : "Pendente"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Alerts */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Ação Prioritária</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-sm mb-4">
                Existem <strong>{pendingVerifications || 0} motoristas</strong> aguardando validação de documentos para começar a trabalhar.
              </p>
              <Button variant="secondary" className="w-full font-bold text-primary">
                Ir para Verificações
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Resumo de Qualidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Perfis Completos</span>
                  <span className="text-slate-900">72%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[72%] bg-blue-500 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-500">Documentação OK</span>
                  <span className="text-slate-900">45%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full w-[45%] bg-amber-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
