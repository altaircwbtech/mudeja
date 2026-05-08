'use client'

import { useState } from "react";
import { Star, Loader2, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { submitReview } from "@/lib/request-actions";

interface ReviewFormClientProps {
  requestId: string;
  providerId: string;
}

export default function ReviewFormClient({ requestId, providerId }: ReviewFormClientProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append("request_id", requestId);
    formData.append("provider_id", providerId);
    formData.append("rating", rating.toString());

    try {
      const result = await submitReview(formData);
      if (result.success) {
        toast.success("Obrigado pela sua avaliação!");
        router.push(`/cliente/solicitacao/${requestId}?success=reviewed`);
        router.refresh();
      } else {
        toast.error("Erro ao enviar avaliação.");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Stars Section */}
      <div className="flex flex-col items-center gap-4">
        <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Sua Nota
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1 transition-transform active:scale-90 hover:scale-110"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-10 w-10 transition-colors ${
                  star <= (hover || rating)
                    ? "fill-primary text-primary"
                    : "text-slate-200"
                }`}
              />
            </button>
          ))}
        </div>
        <div className="h-6">
            {rating > 0 && (
                <span className="text-sm font-black text-primary animate-in fade-in slide-in-from-bottom-1">
                    {rating === 1 && "Péssimo 😞"}
                    {rating === 2 && "Ruim 😐"}
                    {rating === 3 && "Regular 🙂"}
                    {rating === 4 && "Muito Bom! 😃"}
                    {rating === 5 && "Excelente! 😍"}
                </span>
            )}
        </div>
      </div>

      {/* Comment Section */}
      <div className="space-y-3">
        <label className="text-sm font-bold flex items-center gap-2 text-slate-700">
          <MessageSquare className="h-4 w-4 text-primary" />
          Conte mais sobre sua experiência
        </label>
        <Textarea
          name="comment"
          placeholder="O motorista foi cuidadoso? Chegou no horário? Conte para outros clientes..."
          className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-colors resize-none"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
        disabled={loading || rating === 0}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Finalizar e Avaliar
          </>
        )}
      </Button>
    </form>
  );
}
