import clsx from "clsx";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx("rounded-2xl border border-border bg-panel p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}
