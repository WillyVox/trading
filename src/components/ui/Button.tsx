import clsx from "clsx";
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  variant?:
    "primary" | "secondary" | "ghost" | "gold" | "outline" | "outline-soft";
  className?: string;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const VARIANT_CLASS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-navy text-background hover:bg-navy-dark",
  secondary:
    "border border-border bg-panel-secondary text-navy hover:bg-border",
  ghost: "border border-border bg-panel text-navy hover:bg-panel-secondary",
  // On-dark variants for use inside PageHero's navy band.
  gold: "bg-gold text-navy hover:bg-gold-soft",
  outline: "border border-white/40 text-white hover:bg-white/10",
  // Second-tier "on-dark" CTA that still reads as a real sibling action
  // (not a lesser afterthought) next to the solid `gold` button — see the
  // homepage hero, which pairs "Explore crypto exchanges" (gold) with
  // "Explore share trading platforms" (outline-soft) as equal-weight CTAs.
  "outline-soft": "border border-gold-soft text-white hover:bg-white/10",
};

const BASE =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors";

export function Button({
  children,
  variant = "primary",
  className,
  href,
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = clsx(BASE, VARIANT_CLASS[variant], className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
