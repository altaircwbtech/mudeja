import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { RequestForm } from "./request-form";
import { ChevronLeft } from "lucide-react";

export default async function NovaSolicitacaoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-3xl items-center px-4">
          <Link
            href="/cliente"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
          <div className="ml-auto">
            <Logo size="sm" />
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-3xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Nova solicitação</h1>
          <p className="mt-2 text-muted-foreground">
            Descreva os detalhes do serviço para receber orçamentos precisos dos profissionais.
          </p>
        </div>

        <RequestForm userId={user.id} />
      </main>
    </div>
  );
}
