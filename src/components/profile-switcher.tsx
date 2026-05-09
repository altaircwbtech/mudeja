"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Truck, 
  User, 
  ArrowRightLeft, 
  PlusCircle, 
  LayoutDashboard,
  ShieldCheck
} from "lucide-react";

interface ProfileSwitcherProps {
  isProvider: boolean;
  userName: string | null;
}

export function ProfileSwitcher({ isProvider, userName }: ProfileSwitcherProps) {
  const pathname = usePathname();
  
  const isProviderDashboard = pathname?.startsWith("/prestador");
  const isClientDashboard = pathname?.startsWith("/cliente");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "gap-2 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10 transition-all px-4 h-9 cursor-pointer"
      )}>
        <ArrowRightLeft className="h-4 w-4 text-primary" />
        <span className="text-xs font-bold text-slate-700 hidden sm:inline">
          {isClientDashboard ? "Perfil Cliente" : "Perfil Prestador"}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl shadow-2xl border-slate-100">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-2">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">Alternar Visão</p>
            <p className="text-sm font-bold text-slate-900 mt-1">{userName || "Meu Perfil"}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="my-2" />

        <Link href="/cliente">
          <DropdownMenuItem className={`gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isClientDashboard ? 'bg-primary/5 text-primary' : 'text-slate-600'}`}>
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isClientDashboard ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-500'}`}>
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm">Cliente</span>
              <span className="text-[10px] opacity-70">Quero contratar</span>
            </div>
            {isClientDashboard && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
          </DropdownMenuItem>
        </Link>

        {isProvider ? (
          <Link href="/prestador">
            <DropdownMenuItem className={`gap-3 p-3 mt-1 rounded-xl cursor-pointer transition-colors ${isProviderDashboard ? 'bg-primary/5 text-primary' : 'text-slate-600'}`}>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isProviderDashboard ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-500'}`}>
                <Truck className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Prestador</span>
                <span className="text-[10px] opacity-70">Quero trabalhar</span>
              </div>
              {isProviderDashboard && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
            </DropdownMenuItem>
          </Link>
        ) : (
          <Link href="/onboarding/profissional">
            <DropdownMenuItem className="gap-3 p-3 mt-1 rounded-xl cursor-pointer border-2 border-dashed border-primary/20 text-primary hover:bg-primary/5 group">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Ser um Parceiro</span>
                <span className="text-[10px] opacity-70">Ganhe dinheiro</span>
              </div>
            </DropdownMenuItem>
          </Link>
        )}

        <DropdownMenuSeparator className="my-2" />
        
        <div className="px-3 py-2">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium bg-slate-50 p-2 rounded-lg">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Conta Verificada & Segura
            </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
