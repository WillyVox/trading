import type { ReactNode } from "react";
export function CalculationResult({
  title,
  value,
  context,
  children,
}: {
  title: string;
  value?: string;
  context?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <p className="text-gold-dark text-xs font-bold tracking-wider uppercase">
        Estimate
      </p>
      <h2
        id="brokerage-result"
        className="font-display text-navy mt-2 text-xl font-bold"
      >
        {title}
      </h2>
      {value ? (
        <>
          <p className="font-display text-navy mt-4 text-4xl font-bold break-words">
            {value}
          </p>
          {context && <p className="text-muted mt-2 text-sm">{context}</p>}
        </>
      ) : (
        <p className="text-navy mt-4 text-lg font-semibold">
          Unable to calculate this scenario
        </p>
      )}
      {children}
    </>
  );
}
