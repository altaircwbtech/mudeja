"use client";

import { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitReview } from "@/lib/review-actions";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  requestId: string;
  providerId: string;
  providerName: string;
}

export default function ReviewFormClient({ requestId, providerId, providerName }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Por favor, selecione uma nota de 1 a 5 estrelas.");
      return;
    }

    setLoading(true);
    const result = await submitReview({
      request_id: requestId,
      provider_id: providerId,
      rating,
      comment
    });

    if (result.success) {
      setSubmitted(true);
      toast.success("Sua avaliação foi enviada!");
      setTimeout(() => {
        router.push("/cliente");
        router.refresh();
      }, 3000);
    } else {
      toast.error(result.error || "Erro ao enviar avaliação");
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Obrigado pela avaliação!</h3>
        <p className="text-slate-500 mt-2">Você ajudou o {providerName} a crescer na plataforma.</p>
        <p className="text-xs text-slate-400 mt-8">Redirecionando você de volta...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stars Selector */}
      <div className="flex flex-col items-center space-y-3">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sua nota geral</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-transform active:scale-90"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star 
                className={`h-10 w-10 md:h-12 md:w-12 transition-colors duration-200 ${
                  (hoverRating || rating) >= star 
                    ? "fill-amber-400 text-amber-400 drop-shadow-sm" 
                    : "text-slate-200 fill-slate-50"
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm font-bold text-amber-600 h-5">
          {hoverRating === 1 || rating === 1 ? "Péssimo" : 
           hoverRating === 2 || rating === 2 ? "Poderia ser melhor" : 
           hoverRating === 3 || rating === 3 ? "Ok, normal" : 
           hoverRating === 4 || rating === 4 ? "Muito bom!" : 
           hoverRating === 5 || rating === 5 ? "Incrível, nota 10!" : ""}
        </p>
      </div>

      {/* Comment Section */}
      <div className="space-y-3">
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Conte os detalhes (opcional)</p>
        <Textarea 
          placeholder="O que você mais gostou no serviço? O motorista foi cuidadoso? Chegou no horário?"
          className="min-h-[120px] rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all text-lg"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      <Button 
        className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 gap-2"
        onClick={handleSubmit}
        disabled={loading}
        loading={loading}
      >
        <Send className="h-5 w-5" /> Enviar Avaliação
      </Button>
    </div>
  );
}
