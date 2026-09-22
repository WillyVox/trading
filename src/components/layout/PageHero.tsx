import type { ReactNode } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import {
  HeroGraphic,
  type HeroGraphicVariant,
} from "@/components/layout/HeroGraphic";
import type { BreadcrumbItem } from "@/lib/seo/types";

type HeroCta = {
  label: string;
  href: string;
  variant?: "gold" | "outline" | "outline-soft";
};

type HeroNote = {
  label: string;
  href: string;
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
  note,
  maxWidth = "max-w-6xl",
  graphic,
}: {
  breadcrumbs?: BreadcrumbItem[];
  eyebrow?: ReactNode;
  title: ReactNode;
  subheading?: ReactNode;
  meta?: ReactNode[];
  ctas?: HeroCta[];
  /** Quiet text link rendered under the CTAs — for a secondary/trust-signal
   *  link (e.g. "or read our methodology") that shouldn't compete with the
   *  primary CTA(s) for visual weight. */
  note?: HeroNote;
  maxWidth?: string;
  graphic?: HeroGraphicVariant;
}) {
  return (
    <div className="border-gold bg-navy border-b-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="bg-panel-secondary border-b border-white/10">
          <div className={`mx-auto ${maxWidth} px-4 py-3`}>
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>
      )}

      <div
        className={`relative mx-auto ${maxWidth} overflow-hidden px-4 py-12 md:py-16`}
      >
        {graphic && (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[200px] md:block lg:w-[280px]"
            style={{
              maskImage:
                "linear-gradient(to left, black 60%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to left, black 60%, transparent 100%)",
            }}
          >
            <HeroGraphic variant={graphic} />
          </div>
        )}

        <div className="relative">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

          <h1 className="font-display mt-5 max-w-3xl text-4xl leading-[1.05] font-extrabold text-white sm:text-5xl md:text-6xl">
            {title}
          </h1>

          {subheading && (
            <p className="mt-4 max-w-2xl text-lg text-white/75">{subheading}</p>
          )}

          {ctas && ctas.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((cta) => (
                <Button
                  key={cta.href}
                  href={cta.href}
                  variant={cta.variant ?? "gold"}
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          )}

          {note && (
            <Link
              href={note.href}
              className="focus-visible:ring-gold-soft mt-4 inline-block text-sm text-white/60 underline decoration-white/30 underline-offset-2 hover:text-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              {note.label}
            </Link>
          )}

          {meta && meta.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-wide text-white/55 uppercase">
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
