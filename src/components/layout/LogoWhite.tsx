import type { SVGProps } from "react";

// TradingGuide.com.au

export default function TradingGuideLogoWhite(
  props: SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 60"
      width="260"
      height="60"
      {...props}
    >
      <g transform="translate(6,10)">
        <rect x="0" y="16" width="9" height="24" fill="#c79a3d" />
        <rect x="13" y="4" width="9" height="36" fill="#ffffff" />
        <rect x="26" y="20" width="9" height="20" fill="#c79a3d" />
        <rect x="39" y="-6" width="9" height="46" fill="#ffffff" />
      </g>

      <text
        x="62"
        y="38"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="26"
        fill="#ffffff"
      >
        Trading Guide
      </text>

      <text
        x="254"
        y="55"
        textAnchor="end"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="14"
        letterSpacing="1.5"
        fill="#ffffff"
      >
        .com.au
      </text>
    </svg>
  );
}