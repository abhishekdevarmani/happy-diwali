import type { CSSProperties } from "react";
import Rangoli from "./Rangoli";

// Deterministic (integer-only) values so server and client markup always match.
const EMBERS = Array.from({ length: 26 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  size: 2 + (i % 3) * 2,
  dur: 9 + ((i * 7) % 9),
  delay: -((i * 13) % 17),
  dx: ((i * 29) % 90) - 45,
}));

export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute left-1/2 top-[60%] w-[1100px] max-w-none -translate-x-1/2">
        <Rangoli className="animate-spin-slow text-amber-300 opacity-[0.07]" />
      </div>
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className={`ember ${i > 13 ? "max-sm:hidden" : ""}`}
          style={
            {
              left: `${e.left}%`,
              width: e.size,
              height: e.size,
              "--dur": `${e.dur}s`,
              "--delay": `${e.delay}s`,
              "--dx": `${e.dx}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
