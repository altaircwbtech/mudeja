import { cn } from "@/lib/utils";

interface LogoIconProps {
  className?: string;
  size?: number;
}

/**
 * MovaFácil truck icon — inspired by the brand mockup.
 * Stylized truck with motion lines, friendly and modern.
 */
export function LogoIcon({ className, size = 24 }: LogoIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
    >
      {/* Motion lines */}
      <rect x="2" y="16" width="8" height="3" rx="1.5" fill="currentColor" opacity="0.5" />
      <rect x="4" y="22" width="6" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
      <rect x="2" y="28" width="8" height="3" rx="1.5" fill="currentColor" opacity="0.5" />

      {/* Truck cargo/box */}
      <rect x="16" y="10" width="22" height="20" rx="3" fill="currentColor" />

      {/* Cargo detail line */}
      <rect x="16" y="10" width="3" height="20" rx="1.5" fill="currentColor" opacity="0.8" />

      {/* Truck cab */}
      <path
        d="M38 18H43C44.6569 18 46 19.3431 46 21V28C46 29.1046 45.1046 30 44 30H38V18Z"
        fill="currentColor"
      />

      {/* Cab window */}
      <path
        d="M39.5 19.5H42.5C43.3284 19.5 44 20.1716 44 21V24.5H39.5V19.5Z"
        fill="currentColor"
        opacity="0.4"
      />

      {/* Wheels */}
      <circle cx="23" cy="33" r="4" fill="currentColor" />
      <circle cx="23" cy="33" r="2" fill="white" opacity="0.3" />
      <circle cx="41" cy="33" r="4" fill="currentColor" />
      <circle cx="41" cy="33" r="2" fill="white" opacity="0.3" />

      {/* Wheel axle line */}
      <rect x="27" y="31.5" width="10" height="3" rx="1.5" fill="currentColor" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Full MovaFácil logo — icon + text
 */
export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 18, text: "text-lg", gap: "gap-2", box: "h-7 w-7 rounded-md" },
    md: { icon: 20, text: "text-xl", gap: "gap-2.5", box: "h-9 w-9 rounded-lg" },
    lg: { icon: 28, text: "text-3xl", gap: "gap-3", box: "h-12 w-12 rounded-xl" },
  };

  const s = sizes[size];

  return (
    <div className={cn("flex items-center", s.gap, className)}>
      <div
        className={cn(
          "flex items-center justify-center bg-primary text-primary-foreground",
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
