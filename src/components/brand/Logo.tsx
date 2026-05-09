import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Full MovaFácil logo — official image icon + text.
 */
export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { box: "h-8 w-8 rounded-lg", text: "text-lg", gap: "gap-2" },
    md: { box: "h-9 w-9 rounded-xl", text: "text-xl", gap: "gap-2.5" },
    lg: { box: "h-14 w-14 rounded-2xl", text: "text-3xl", gap: "gap-3" },
    xl: { box: "h-20 w-20 rounded-[2rem]", text: "text-4xl", gap: "gap-4" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <div className={cn("relative overflow-hidden shadow-sm", s.box)}>
        <Image 
          src="/logo.png" 
          alt="MovaFácil Logo" 
          fill 
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight text-slate-900", s.text)}>
          Mova<span className="text-primary">Fácil</span>
        </span>
      )}
    </div>
  );
}
