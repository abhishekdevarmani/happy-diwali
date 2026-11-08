import type { CSSProperties } from "react";

export function Diya({
  size = 56,
  delay = 0,
  bright = false,
  className = "",
}: {
  size?: number;
  delay?: number;
  bright?: boolean;
  className?: string;
}) {
  const style = { "--s": `${size}px`, "--d": `${-delay}s` } as CSSProperties;
  return (
    <div className={`diya ${bright ? "diya-bright" : ""} ${className}`} style={style} aria-hidden="true">
      <span className="diya-glow" />
      <span className="diya-flame" />
      <svg className="diya-bowl" viewBox="0 0 100 46" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="diyaBowl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd166" />
            <stop offset="0.45" stopColor="#e07a1f" />
            <stop offset="1" stopColor="#8a2f0c" />
          </linearGradient>
        </defs>
        <path d="M2 10 Q50 -2 98 10 Q94 40 50 44 Q6 40 2 10Z" fill="url(#diyaBowl)" />
        <path d="M2 10 Q50 -2 98 10" fill="none" stroke="#fff1c1" strokeWidth="1.8" strokeLinecap="round" />
        <g fill="#fff1c1" opacity="0.75">
          <circle cx="30" cy="22" r="1.8" />
          <circle cx="40" cy="27" r="1.8" />
          <circle cx="50" cy="29" r="1.8" />
          <circle cx="60" cy="27" r="1.8" />
          <circle cx="70" cy="22" r="1.8" />
        </g>
      </svg>
    </div>
  );
}

const ROW: { s: number; d: number; hideOnMobile?: boolean }[] = [
  { s: 30, d: 0.7, hideOnMobile: true },
  { s: 38, d: 0.2 },
  { s: 52, d: 0.9 },
  { s: 64, d: 0.4 },
  { s: 52, d: 1.3 },
  { s: 38, d: 0.6 },
  { s: 30, d: 1.1, hideOnMobile: true },
];

export default function DiyaRow({ bright = false, compact = false }: { bright?: boolean; compact?: boolean }) {
  const k = compact ? 0.78 : 1;
  return (
    <div className="flex items-end justify-center gap-3 sm:gap-5" aria-hidden="true">
      {ROW.map((d, i) => (
        <Diya
          key={i}
          size={Math.round(d.s * k)}
          delay={d.d}
          bright={bright}
          className={d.hideOnMobile ? "max-sm:hidden" : ""}
        />
      ))}
    </div>
  );
}
