import type { SVGProps } from "react";

// TradingGui.com.au
export default function TradingGuideLogoWhite(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 86"
      width="280"
      height="86"
      {...props}
    >
      <g transform="translate(6,10)">
        <rect x="0" y="16" width="9" height="24" fill="#c79a3d" />
        <rect x="13" y="4" width="9" height="36" fill="#ffffff" />
        <rect x="26" y="20" width="9" height="20" fill="#c79a3d" />
        <rect x="39" y="-6" width="9" height="46" fill="#ffffff" />
      </g>
      <text
        x="270"
        y="38"
        text-anchor="end"
        font-family="Georgia, 'Times New Roman', serif"
        font-weight="700"
        font-size="26"
        fill="#ffffff"
      >
        Trading Guide
      </text>
      <text
        x="270"
        y="60"
        text-anchor="end"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="14"
        letter-spacing="1.5"
        fill="#ffffff"
      >
        .com.au
      </text>
    </svg>
  );
}
