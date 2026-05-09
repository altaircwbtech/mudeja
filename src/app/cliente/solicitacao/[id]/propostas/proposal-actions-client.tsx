"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Check, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export function AcceptButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit"
      disabled={disabled || pending}
      className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 group/btn"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processando...
        </>
      ) : (
        "Aceitar Proposta"
      )}
    </Button>
  );
}

export function RejectButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit"
      variant="ghost" 
      disabled={disabled || pending}
      className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
    >
      {pending ? (
        <Loader2 className="h-3 w-3 animate-spin mr-1" />
      ) : (
        <XCircle className="h-3 w-3 mr-1" />
      )}
      Dispensar
    </Button>
  );
}
