import type { SVGProps } from "react";

// TradingGui.com.au
export default function TradingGuideLogoDrak(props: SVGProps<SVGSVGElement>) {
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
        <rect x="13" y="4" width="9" height="36" fill="#16233f" />
        <rect x="26" y="20" width="9" height="20" fill="#c79a3d" />
        <rect x="39" y="-6" width="9" height="46" fill="#16233f" />
      </g>
      <text
        x="62"
        y="38"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight="700"
        fontSize="26"
        fill="#16233f"
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
        fill="#8a8577"
      >
        .com.au
      </text>
    </svg>
  );
}
