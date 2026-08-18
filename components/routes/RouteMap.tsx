"use client";

import { useTranslations } from "next-intl";

export default function RouteMap() {
  const t = useTranslations("routes");

  return (
    <div className="card-luxury mx-auto max-w-4xl">
      <svg viewBox="0 0 800 300" className="w-full" aria-label={t("title")}>
        <defs>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A227" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#E8A317" />
            <stop offset="100%" stopColor="#C9A227" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        <path
          d="M 80 150 Q 200 80 350 150 T 620 150 T 720 150"
          stroke="url(#routeGrad)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="8 4"
          className="route-pulse"
        />

        {[
          { x: 80, label: "easternProvince" },
          { x: 350, label: "causeway" },
          { x: 500, label: "bahrain" },
          { x: 720, label: "riyadh" },
        ].map(({ x, label }) => (
          <g key={label}>
            <circle cx={x} cy={150} r="12" fill="#0A0A0A" stroke="#C9A227" strokeWidth="2" />
            <circle cx={x} cy={150} r="5" fill="#E8A317" />
            <text
              x={x}
              y={200}
              textAnchor="middle"
              fill="#C9A227"
              fontSize="12"
              fontFamily="serif"
            >
              {t(label as "easternProvince" | "causeway" | "bahrain" | "riyadh")}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
