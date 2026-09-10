import clsx from "clsx";

export function Badge({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "green" | "red" | "blue" | "gold";
}) {
  const toneClass = {
    muted: "bg-panel-secondary text-muted border-border",
    green: "bg-green/10 text-green border-green/30",
    red: "bg-red/10 text-red border-red/30",
    blue: "bg-blue/10 text-blue border-blue/30",
    gold: "bg-gold/10 text-gold border-gold/40",
  }[tone];

  return (
    <span className={clsx("inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium", toneClass)}>
      {children}
    </span>
  );
}
