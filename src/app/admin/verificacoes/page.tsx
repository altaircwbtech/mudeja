import { createClient } from "@/lib/supabase/server";
import VerificationListClient from "./VerificationListClient";
import { ShieldCheck, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function VerificationsPage() {
  const supabase = await createClient();

  // Fetch providers needing verification
  const { data: providers, error } = await supabase
    .from("providers")
    .select("*, users(full_name, email, phone, avatar_url)")
    .eq("document_verified", false)
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verificações Pendentes</h2>
          <p className="text-slate-500">Valide os documentos dos motoristas para garantir a segurança da plataforma.</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
      </div>

      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle className="font-bold">Dica de Segurança</AlertTitle>
        <AlertDescription>
          Sempre verifique se o nome na CNH coincide com o nome de cadastro e se a validade do documento está em dia.
        </AlertDescription>
      </Alert>

      {providers && providers.length > 0 ? (
        <VerificationListClient initialProviders={providers} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Tudo em dia!</h3>
          <p className="text-slate-500 max-w-xs text-center">Não há novos documentos aguardando validação no momento.</p>
        </div>
      )}
    </div>
  );
}
