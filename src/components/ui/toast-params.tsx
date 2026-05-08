"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ToastParams() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (error) {
      toast.error("Oops!", {
        description: decodeURIComponent(error),
      });
    }

    if (success) {
      let message = decodeURIComponent(success);
      if (success === "logged_out") message = "Você saiu com sucesso.";
      else if (success === "proposal_sent") message = "Sua proposta foi enviada ao cliente!";
      else if (success === "request_created") message = "Solicitação criada! Os motoristas da região já foram avisados.";
      else if (success === "profile_updated") message = "Seu perfil foi atualizado.";

      toast.success("Sucesso!", {
        description: message,
      });
    }
  }, [searchParams]);

  return null;
}
