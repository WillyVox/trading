import type { ReactNode } from "react";

type Step = { label: string; detail?: string };

type Props = {
  title: string;
  caption?: string;
  steps?: Step[];
  columns?: { title: string; items: string[] }[];
  example?: { label: string; value: string }[];
  footer?: ReactNode;
};

export function LearningDiagram({
  title,
  caption,
  steps,
  columns,
  example,
  footer,
}: Props) {
  return (
    <figure className="not-prose border-border my-7 overflow-hidden rounded-2xl border bg-white shadow-sm">
      <figcaption className="border-border bg-sand/45 border-b px-5 py-4 sm:px-6">
        <p className="text-gold text-xs font-bold tracking-[0.16em] uppercase">
          Visual explainer
        </p>
        <p className="font-display text-navy mt-1 text-lg font-bold">{title}</p>
        {caption ? (
          <p className="text-muted mt-1 text-sm leading-6">{caption}</p>
        ) : null}
      </figcaption>
      {steps?.length ? (
        <div className="grid gap-2 p-5 sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] sm:items-stretch sm:p-6">
          {steps.map((step, index) => (
            <div
              key={`${step.label}-${index}`}
              className="relative flex min-w-0 items-center gap-3 sm:block"
            >
              <div className="border-border bg-sand/25 flex-1 rounded-xl border p-4 text-center sm:h-full">
                <p className="text-navy text-sm font-bold">{step.label}</p>
                {step.detail ? (
                  <p className="text-muted mt-1 text-xs leading-5">
                    {step.detail}
                  </p>
                ) : null}
              </div>
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="text-gold shrink-0 text-lg font-bold sm:absolute sm:top-1/2 sm:-right-2.5 sm:z-10 sm:-translate-y-1/2"
                >
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {columns?.length ? (
        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          {columns.map((column) => (
            <div
              key={column.title}
              className="border-border bg-sand/20 rounded-xl border p-4"
            >
              <p className="font-display text-navy font-bold">{column.title}</p>
              <ul className="text-muted mt-3 space-y-2 text-sm leading-6">
                {column.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="text-gold">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
      {example?.length ? (
        <div className="border-border bg-border grid gap-px border-t sm:grid-cols-2 lg:grid-cols-4">
          {example.map((item) => (
            <div key={item.label} className="bg-white px-5 py-4">
              <p className="text-muted text-xs font-semibold tracking-wide uppercase">
                {item.label}
              </p>
              <p className="font-display text-navy mt-1 text-lg font-bold">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      ) : null}
      {footer ? (
        <div className="border-border bg-sand/20 text-muted border-t px-5 py-4 text-sm leading-6 sm:px-6">
          {footer}
        </div>
      ) : null}
    </figure>
  );
}
