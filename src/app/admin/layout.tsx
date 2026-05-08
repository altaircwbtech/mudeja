import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  // Proteção de Rota Admin
  if (profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r bg-white lg:flex">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-2 font-black text-primary text-xl">
            <Truck className="h-6 w-6" />
            <span>MovaFácil <span className="text-slate-400 font-medium text-xs uppercase tracking-widest">Admin</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start gap-3 font-medium">
              <LayoutDashboard className="h-5 w-5 text-slate-500" />
              Visão Geral
            </Button>
          </Link>
          <Link href="/admin/verificacoes">
            <Button variant="ghost" className="w-full justify-start gap-3 font-medium">
              <ShieldCheck className="h-5 w-5 text-slate-500" />
              Verificações
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-600">
                12
              </span>
            </Button>
          </Link>
          <Link href="/admin/usuarios">
            <Button variant="ghost" className="w-full justify-start gap-3 font-medium">
              <Users className="h-5 w-5 text-slate-500" />
              Usuários
            </Button>
          </Link>
        </nav>

        <div className="border-t p-4">
          <Link href="/admin/configuracoes">
            <Button variant="ghost" className="w-full justify-start gap-3 font-medium">
              <Settings className="h-5 w-5 text-slate-500" />
              Configurações
            </Button>
          </Link>
          <form action="/auth/signout" method="post">
            <Button variant="ghost" className="w-full justify-start gap-3 font-medium text-red-600 hover:bg-red-50 hover:text-red-700">
              <LogOut className="h-5 w-5" />
              Sair
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md">
          <div className="flex max-w-md flex-1 items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-slate-500">
            <Search className="h-4 w-4" />
            <input 
              type="text" 
              placeholder="Buscar motorista, placa ou pedido..." 
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
