import type { JSX } from "react";

export type HeroGraphicVariant =
  | "home"
  | "crypto"
  | "guides"
  | "compare"
  | "methodology";

const GOLD = "#c79a3d";
const GOLD_SOFT = "#e8d9b5";
const CREAM = "#f5f2ea";

function HomeGraphic() {
  return (
    <>
      <polyline
        points="0,96 40,76 80,56 120,36 160,16"
        fill="none"
        stroke={CREAM}
        strokeOpacity={0.5}
        strokeWidth={1.5}
      />
      <rect x="10" y="86" width="18" height="34" fill={GOLD_SOFT} fillOpacity={0.55} />
      <rect x="50" y="66" width="18" height="54" fill={GOLD} fillOpacity={0.55} />
      <rect x="90" y="46" width="18" height="74" fill={GOLD_SOFT} fillOpacity={0.55} />
      <rect x="130" y="26" width="18" height="94" fill={GOLD} fillOpacity={0.7} />
      <circle cx="150" cy="20" r="16" fill="none" stroke={GOLD} strokeWidth={1.5} strokeOpacity={0.8} />
      <path
        d="M143 20 L148 25 L158 12"
        fill="none"
        stroke={GOLD}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.8}
      />
    </>
  );
}

function CryptoGraphic() {
  return (
    <>
      <line x1="80" y1="40" x2="30" y2="86" stroke={CREAM} strokeOpacity={0.3} strokeWidth={1} />
      <line x1="80" y1="40" x2="140" y2="70" stroke={CREAM} strokeOpacity={0.3} strokeWidth={1} />
      <line x1="80" y1="40" x2="55" y2="112" stroke={CREAM} strokeOpacity={0.3} strokeWidth={1} />
      <line x1="80" y1="40" x2="150" y2="118" stroke={CREAM} strokeOpacity={0.3} strokeWidth={1} />
      <line x1="30" y1="86" x2="55" y2="112" stroke={CREAM} strokeOpacity={0.18} strokeWidth={1} />
      <circle cx="80" cy="40" r="13" fill={GOLD} fillOpacity={0.85} />
      <circle cx="30" cy="86" r="7" fill={GOLD_SOFT} fillOpacity={0.6} />
      <circle cx="140" cy="70" r="7" fill={GOLD_SOFT} fillOpacity={0.6} />
      <circle cx="55" cy="112" r="7" fill={GOLD_SOFT} fillOpacity={0.6} />
      <circle cx="150" cy="118" r="7" fill={GOLD_SOFT} fillOpacity={0.6} />
    </>
  );
}

function GuidesGraphic() {
  return (
    <>
      <path
        d="M20 96 v-30 q0,-6 6,-6 h34 v42 h-34 q-6,0 -6,-6 z"
        fill="none"
        stroke={CREAM}
        strokeOpacity={0.55}
        strokeWidth={1.5}
      />
      <path
        d="M60 60 h34 q6,0 6,6 v30 q0,6 -6,6 h-34 z"
        fill="none"
        stroke={CREAM}
        strokeOpacity={0.55}
        strokeWidth={1.5}
      />
      <line x1="60" y1="60" x2="60" y2="102" stroke={CREAM} strokeOpacity={0.55} strokeWidth={1.5} />
      <rect x="120" y="82" width="24" height="18" fill={GOLD_SOFT} fillOpacity={0.55} />
      <rect x="148" y="66" width="24" height="34" fill={GOLD} fillOpacity={0.6} />
      <rect x="176" y="50" width="20" height="50" fill={GOLD} fillOpacity={0.75} />
    </>
  );
}

function CompareGraphic() {
  return (
    <>
      <line
        x1="40"
        y1="52"
        x2="160"
        y2="52"
        stroke={CREAM}
        strokeOpacity={0.4}
        strokeWidth={1}
        strokeDasharray="3,4"
      />
      <rect x="40" y="52" width="26" height="58" fill={GOLD_SOFT} fillOpacity={0.55} />
      <rect x="80" y="24" width="26" height="86" fill={GOLD} fillOpacity={0.7} />
      <rect x="120" y="64" width="26" height="46" fill={GOLD_SOFT} fillOpacity={0.55} />
      <circle cx="53" cy="44" r="2.5" fill={CREAM} fillOpacity={0.6} />
      <circle cx="93" cy="16" r="2.5" fill={CREAM} fillOpacity={0.6} />
      <circle cx="133" cy="56" r="2.5" fill={CREAM} fillOpacity={0.6} />
    </>
  );
}

function MethodologyGraphic() {
  return (
    <>
      <rect
        x="30"
        y="20"
        width="62"
        height="80"
        rx="4"
        fill="none"
        stroke={CREAM}
        strokeOpacity={0.5}
        strokeWidth={1.5}
      />
      <line x1="42" y1="40" x2="80" y2="40" stroke={CREAM} strokeOpacity={0.5} strokeWidth={1.5} />
      <line x1="42" y1="54" x2="80" y2="54" stroke={CREAM} strokeOpacity={0.5} strokeWidth={1.5} />
      <line x1="42" y1="68" x2="66" y2="68" stroke={CREAM} strokeOpacity={0.5} strokeWidth={1.5} />
      <circle cx="138" cy="70" r="24" fill="none" stroke={GOLD} strokeWidth={3} strokeOpacity={0.85} />
      <line
        x1="156"
        y1="88"
        x2="174"
        y2="106"
        stroke={GOLD}
        strokeWidth={3}
        strokeLinecap="round"
        strokeOpacity={0.85}
      />
      <path
        d="M126 70 L134 78 L150 58"
        fill="none"
        stroke={GOLD}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.85}
      />
    </>
  );
}

const GRAPHICS: Record<HeroGraphicVariant, () => JSX.Element> = {
  home: HomeGraphic,
  crypto: CryptoGraphic,
  guides: GuidesGraphic,
  compare: CompareGraphic,
  methodology: MethodologyGraphic,
};

/**
 * Decorative, topic-matched line art for the right-hand side of PageHero.
 * Pure inline SVG (no external image request, negligible weight) so it
 * never competes with the H1 for LCP or search relevance — see PageHero's
 * own doc comment on staying typographic. aria-hidden because it carries
 * no information not already in the heading/subheading.
 */
export function HeroGraphic({ variant }: { variant: HeroGraphicVariant }) {
  const Graphic = GRAPHICS[variant];
  return (
    <svg
      viewBox="0 0 200 120"
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <Graphic />
    </svg>
  );
}