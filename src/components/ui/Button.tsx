import clsx from "clsx";
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const VARIANT_CLASS: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-navy text-background hover:bg-navy-dark",
  secondary: "border border-border bg-panel-secondary text-navy hover:bg-border",
  ghost: "border border-border bg-panel text-navy hover:bg-panel-secondary",
};

const BASE = "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors";

export function Button({ children, variant = "primary", className, href, type = "button", onClick }: ButtonProps) {
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
