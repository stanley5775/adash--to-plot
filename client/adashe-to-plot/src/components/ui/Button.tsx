import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-[0_8px_24px_-8px_rgba(198,151,26,0.55)]",
  secondary: "bg-navy-800 text-white hover:bg-navy-700",
  outline: "border border-navy-800/20 text-navy-900 hover:border-navy-800 bg-white",
  ghost: "text-navy-900 hover:bg-navy-100",
  whatsapp: "bg-[#1FA855] text-white hover:bg-[#188C46]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-7 py-4 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  ...rest
}: BaseProps & { href?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
