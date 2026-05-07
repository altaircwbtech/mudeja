import { cn } from "@/lib/utils";

interface LogoIconProps {
  className?: string;
  size?: number;
}

/**
 * MovaFácil logo icon — Truck carrying a house with motion lines.
 * Recreated from the official brand icon.
 */
export function LogoIcon({ className, size = 24 }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      {/* Motion/speed lines */}
      <rect x="4" y="22" width="12" height="3.5" rx="1.75" fill="currentColor" />
      <rect x="6" y="28" width="10" height="3.5" rx="1.75" fill="currentColor" />
      <rect x="4" y="34" width="12" height="3.5" rx="1.75" fill="currentColor" />

      {/* Truck cargo body — rounded rectangle */}
      <path
        d="M20 14C20 11.7909 21.7909 10 24 10H44C46.2091 10 48 11.7909 48 14V38H20V14Z"
        fill="currentColor"
      />

      {/* Truck cab */}
      <path
        d="M48 24H55C57.2091 24 59 25.7909 59 28V38C59 39.6569 57.6569 41 56 41H48V24Z"
        fill="currentColor"
      />

      {/* Cab windshield (cutout effect) */}
      <path
        d="M50 26H54C55.1046 26 56 26.8954 56 28V33H50V26Z"
        fill="currentColor"
        opacity="0.45"
      />

      {/* House roof — triangle */}
      <path
        d="M34 15L24 25H44L34 15Z"
        fill="currentColor"
        opacity="0.4"
      />

      {/* House body */}
      <rect x="27" y="25" width="14" height="12" fill="currentColor" opacity="0.4" />

      {/* House windows — 4 small squares */}
      <rect x="29.5" y="27" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
      <rect x="35" y="27" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
      <rect x="29.5" y="32.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" />
      <rect x="35" y="32.5" width="3.5" height="3.5" rx="0.5" fill="currentColor" />

      {/* Bottom bar / chassis */}
      <rect x="16" y="40" width="44" height="3" rx="1.5" fill="currentColor" />

      {/* Rear wheel */}
      <circle cx="26" cy="46" r="6" fill="currentColor" />
      <circle cx="26" cy="46" r="3" fill="white" opacity="0.3" />

      {/* Front wheel */}
      <circle cx="52" cy="46" r="6" fill="currentColor" />
      <circle cx="52" cy="46" r="3" fill="white" opacity="0.3" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Full MovaFácil logo — icon + text.
 * The icon shows inside a rounded orange box (matching the app icon style).
 */
export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: "text-lg", gap: "gap-2", box: "h-8 w-8 rounded-lg" },
    md: { icon: 24, text: "text-xl", gap: "gap-2.5", box: "h-9 w-9 rounded-xl" },
    lg: { icon: 32, text: "text-3xl", gap: "gap-3", box: "h-12 w-12 rounded-xl" },
    xl: { icon: 48, text: "text-4xl", gap: "gap-4", box: "h-16 w-16 rounded-2xl" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <div
        className={cn(
          "flex items-center justify-center bg-primary text-primary-foreground shadow-sm",
          s.box
        )}
      >
        <LogoIcon size={s.icon} />
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight", s.text)}>
          Mova<span className="text-primary">Fácil</span>
        </span>
      )}
    </div>
  );
}
