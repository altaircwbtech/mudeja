"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  User, 
  Phone, 
  Mail,
  Calendar,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { approveProviderDocument, rejectProviderDocument } from "../actions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface VerificationListProps {
  initialProviders: any[];
}

export default function VerificationListClient({ initialProviders }: VerificationListProps) {
  const [providers, setProviders] = useState(initialProviders);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    const result = await approveProviderDocument(id);
    
    if (result.success) {
      toast.success("Documento aprovado com sucesso!");
      setProviders(prev => prev.filter(p => p.id !== id));
    } else {
      toast.error(result.error || "Erro ao aprovar documento");
    }
    setLoadingId(null);
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Motivo da rejeição (será enviado ao motorista):");
    if (!reason) return;

    setLoadingId(id);
    const result = await rejectProviderDocument(id, reason);
    
    if (result.success) {
      toast.warning("Documento rejeitado. O motorista foi notificado.");
      setProviders(prev => prev.filter(p => p.id !== id));
    } else {
      toast.error(result.error || "Erro ao rejeitar documento");
    }
    setLoadingId(null);
  };

  return (
    <div className="grid gap-6">
      {providers.map((provider) => (
        <Card key={provider.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col lg:flex-row">
            {/* User Info Section */}
            <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r bg-white">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                  {provider.users?.avatar_url ? (
                    <img src={provider.users.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-slate-300" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">{provider.users?.full_name}</h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Mail className="h-3 w-3" /> {provider.users?.email}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Phone className="h-3 w-3" /> {provider.users?.phone}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="h-3 w-3" /> 
                      Entrou em {format(new Date(provider.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Empresa/Slug</p>
                  <p className="text-sm font-bold text-slate-700">{provider.business_name || "Não definido"}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Trust Score Atual</p>
                  <p className="text-sm font-bold text-primary">{provider.trust_score} pts</p>
                </div>
              </div>
            </div>

            {/* Document & Actions Section */}
            <div className="w-full lg:w-80 bg-slate-50/50 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Documentação</p>
                
                {provider.document_url ? (
                  <a 
                    href={provider.document_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 group hover:border-primary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">Ver CNH / CRLV</span>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-700">URL não encontrada</span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleReject(provider.id)}
                  disabled={loadingId === provider.id}
                >
                  <XCircle className="h-4 w-4" /> Rejeitar
                </Button>
                <Button 
                  className="flex-1 gap-2 font-bold"
                  onClick={() => handleApprove(provider.id)}
                  loading={loadingId === provider.id}
                  disabled={loadingId === provider.id}
                >
                  <CheckCircle2 className="h-4 w-4" /> Aprovar
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
