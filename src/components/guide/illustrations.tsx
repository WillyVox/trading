const GOLD = "#c79a3d";
const GOLD_SOFT = "#e8d9b5";
const CREAM = "#f5f2ea";

const BASE_SVG_PROPS = {
  viewBox: "0 0 800 360",
  className: "h-auto w-full",
  focusable: false,
} as const;

/** Five-step numbered pathway — used in the "simple steps to buy crypto" guide. */
export function StepsFlowIllustration({ title }: { title: string }) {
  const steps = ["1", "2", "3", "4", "5"];
  return (
    <svg {...BASE_SVG_PROPS} role="img" aria-label={title}>
      <title>{title}</title>
      <line
        x1="80"
        y1="180"
        x2="720"
        y2="180"
        stroke={CREAM}
        strokeOpacity={0.25}
        strokeWidth={2}
      />
      {steps.map((n, i) => {
        const x = 80 + i * 160;
        return (
          <g key={n}>
            <circle
              cx={x}
              cy={180}
              r={34}
              fill={i === steps.length - 1 ? GOLD : "none"}
              stroke={GOLD}
              strokeWidth={3}
            />
            <text
              x={x}
              y={190}
              textAnchor="middle"
              fontFamily="Georgia, 'DejaVu Serif', serif"
              fontWeight={700}
              fontSize={30}
              fill={i === steps.length - 1 ? "#16233f" : CREAM}
            >
              {n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Bar chart comparing "market order vs limit order" style cost/fee concepts. */
export function FeesBarIllustration({ title }: { title: string }) {
  const bars = [
    { label: "Maker fee", h: 60, color: GOLD_SOFT },
    { label: "Taker fee", h: 100, color: GOLD },
    { label: "Withdrawal", h: 40, color: GOLD_SOFT },
    { label: "Spread", h: 130, color: GOLD },
  ];
  return (
    <svg {...BASE_SVG_PROPS} role="img" aria-label={title}>
      <title>{title}</title>
      <line
        x1="80"
        y1="280"
        x2="720"
        y2="280"
        stroke={CREAM}
        strokeOpacity={0.3}
        strokeWidth={2}
      />
      {bars.map((b, i) => {
        const x = 150 + i * 140;
        return (
          <g key={b.label}>
            <rect
              x={x - 30}
              y={280 - b.h}
              width={60}
              height={b.h}
              rx={6}
              fill={b.color}
            />
            <text
              x={x}
              y={305}
              textAnchor="middle"
              fontFamily="'DejaVu Sans', Arial, sans-serif"
              fontSize={16}
              fill={CREAM}
            >
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Shield + key motif for wallet/account security sections. */
export function SecurityShieldIllustration({ title }: { title: string }) {
  return (
    <svg {...BASE_SVG_PROPS} role="img" aria-label={title}>
      <title>{title}</title>
      <path
        d="M400 60 L520 100 V190 Q520 290 400 330 Q280 290 280 190 V100 Z"
        fill="none"
        stroke={CREAM}
        strokeOpacity={0.7}
        strokeWidth={4}
      />
      <circle cx="400" cy="185" r="26" fill={GOLD} />
      <rect x="388" y="205" width="24" height="44" fill={GOLD} />
      <path
        d="M330 200 L365 235 L470 130"
        fill="none"
        stroke={CREAM}
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.5}
      />
    </svg>
  );
}

/** Two-column side-by-side comparison bars — used for "share trading vs crypto trading". */
export function CompareColumnsIllustration({
  title,
  labelLeft,
  labelRight,
}: {
  title: string;
  labelLeft: string;
  labelRight: string;
}) {
  return (
    <svg {...BASE_SVG_PROPS} role="img" aria-label={title}>
      <title>{title}</title>
      <line
        x1="400"
        y1="60"
        x2="400"
        y2="280"
        stroke={CREAM}
        strokeOpacity={0.25}
        strokeWidth={2}
        strokeDasharray="6,8"
      />
      <rect x="180" y="120" width="90" height="160" rx="8" fill={GOLD_SOFT} />
      <rect x="290" y="80" width="90" height="200" rx="8" fill={GOLD} />
      <rect x="420" y="150" width="90" height="130" rx="8" fill={GOLD} />
      <rect x="530" y="100" width="90" height="180" rx="8" fill={GOLD_SOFT} />
      <text
        x="270"
        y="315"
        textAnchor="middle"
        fontFamily="'DejaVu Sans', Arial, sans-serif"
        fontWeight={700}
        fontSize={20}
        fill={CREAM}
      >
        {labelLeft}
      </text>
      <text
        x="520"
        y="315"
        textAnchor="middle"
        fontFamily="'DejaVu Sans', Arial, sans-serif"
        fontWeight={700}
        fontSize={20}
        fill={CREAM}
      >
        {labelRight}
      </text>
    </svg>
  );
}

/** Upward trend line with markers — used for long-term investing sections. */
export function GrowthTrendIllustration({ title }: { title: string }) {
  return (
    <svg {...BASE_SVG_PROPS} role="img" aria-label={title}>
      <title>{title}</title>
      <line
        x1="80"
        y1="280"
        x2="720"
        y2="280"
        stroke={CREAM}
        strokeOpacity={0.25}
        strokeWidth={2}
      />
      <line
        x1="80"
        y1="60"
        x2="80"
        y2="280"
        stroke={CREAM}
        strokeOpacity={0.25}
        strokeWidth={2}
      />
      <polyline
        points="100,250 220,230 320,190 420,205 520,140 620,110 700,80"
        fill="none"
        stroke={GOLD}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {[
        [100, 250],
        [220, 230],
        [320, 190],
        [420, 205],
        [520, 140],
        [620, 110],
        [700, 80],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={6} fill={CREAM} />
      ))}
    </svg>
  );
}

/** Magnifying glass over a document — used for "research before you buy" sections. */
export function ResearchIllustration({ title }: { title: string }) {
  return (
    <svg {...BASE_SVG_PROPS} role="img" aria-label={title}>
      <title>{title}</title>
      <rect
        x="280"
        y="60"
        width="180"
        height="240"
        rx="8"
        fill="none"
        stroke={CREAM}
        strokeOpacity={0.6}
        strokeWidth={3}
      />
      {[100, 140, 180, 220].map((y) => (
        <line
          key={y}
          x1="305"
          y1={y}
          x2="435"
          y2={y}
          stroke={CREAM}
          strokeOpacity={0.4}
          strokeWidth={3}
        />
      ))}
      <circle
        cx="500"
        cy="230"
        r="55"
        fill="none"
        stroke={GOLD}
        strokeWidth={7}
      />
      <line
        x1="540"
        y1="270"
        x2="590"
        y2="320"
        stroke={GOLD}
        strokeWidth={9}
        strokeLinecap="round"
      />
    </svg>
  );
}
