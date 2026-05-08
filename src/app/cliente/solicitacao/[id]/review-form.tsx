"use client";

import { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submitReview } from "@/lib/request-actions";
import { toast } from "sonner";

export default function ReviewForm({ requestId, providerId }: { requestId: string, providerId: string }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.warning("Nota pendente", { description: "Por favor, selecione uma nota de 1 a 5 estrelas." });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("request_id", requestId);
      formData.append("provider_id", providerId);
      formData.append("rating", rating.toString());
      formData.append("comment", comment);

      await submitReview(formData);
      toast.success("Avaliação enviada!", { description: "Sua avaliação foi registrada com sucesso." });
    } catch (err: any) {
      toast.error("Erro ao avaliar", { description: err.message || "Ocorreu um erro ao enviar a avaliação." });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t">
      <h4 className="font-semibold text-sm mb-3">Avalie o Motorista</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating)
                    ? "text-amber-500 fill-amber-500"
                    : "text-slate-200 fill-slate-200"
                }`}
              />
            </button>
          ))}
        </div>
        
        <Textarea
          placeholder="Como foi o serviço? (Opcional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="resize-none h-20 text-sm"
          disabled={isSubmitting}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Enviando..." : "Concluir e Enviar Avaliação"}
        </Button>
      </form>
    </div>
  );
}
