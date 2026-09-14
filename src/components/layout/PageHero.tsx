import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { HeroGraphic, type HeroGraphicVariant } from "@/components/layout/HeroGraphic";
import type { BreadcrumbItem } from "@/lib/seo/types";

type HeroCta = {
  label: string;
  href: string;
  variant?: "gold" | "outline";
};

/**
 * Shared full-bleed page header used at the top of every indexable route
 * (see docs — hero rollout plan). One visual band everywhere: light
 * breadcrumb strip -> navy band with a 4px gold bottom border -> eyebrow
 * pill, serif H1, one-line subheading, optional CTAs or a meta line.
 *
 * Deliberately typographic, not photographic — the H1 + subheading here
 * double as on-page SEO copy (kept in sync with <title>/meta description
 * by each page), and a real headline does more for search + LCP than a
 * stock/generated image would. Reuses the existing Breadcrumbs and
 * Eyebrow components unchanged so this is a layout wrapper, not a new
 * design language.
 *
 * `graphic` is an optional inline-SVG accent (see HeroGraphic) — never a
 * raster/photographic image — rendered behind the copy on the right and
 * faded into the navy band so it adds page-specific texture without
 * competing with the H1 for LCP or costing an extra image request.
 */
export function PageHero({
  breadcrumbs,
  eyebrow,
  title,
  subheading,
  meta,
  ctas,
  maxWidth = "max-w-6xl",
  graphic,
}: {
  breadcrumbs?: BreadcrumbItem[];
  eyebrow?: ReactNode;
  title: ReactNode;
  subheading?: ReactNode;
  meta?: ReactNode[];
  ctas?: HeroCta[];
  maxWidth?: string;
  graphic?: HeroGraphicVariant;
}) {
  return (
    <div className="border-b-4 border-gold bg-navy">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="border-b border-white/10 bg-panel-secondary">
          <div className={`mx-auto ${maxWidth} px-4 py-3`}>
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>
      )}

      <div className={`relative mx-auto ${maxWidth} overflow-hidden px-4 py-12 md:py-16`}>
        {graphic && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[200px] md:block lg:w-[280px]"
            style={{
              maskImage: "linear-gradient(to left, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)",
            }}
          >
            <HeroGraphic variant={graphic} />
          </div>
        )}

        <div className="relative">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>

          {subheading && (
            <p className="mt-4 max-w-2xl text-lg text-white/75">{subheading}</p>
          )}

          {ctas && ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((cta) => (
                <Button key={cta.href} href={cta.href} variant={cta.variant ?? "gold"}>
                  {cta.label}
                </Button>
              ))}
            </div>
          )}

          {meta && meta.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-wide text-white/55">
              {meta.map((item, i) => (
                <span key={i} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden="true" className="text-white/25">
                      &middot;
                    </span>
                  )}
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}