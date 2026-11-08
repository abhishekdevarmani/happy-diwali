"use client";

import { useEffect, useMemo, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/**
 * Types text out two characters per tick. Splits by code point so emoji never
 * flash as broken glyphs. Returns the typed and remaining text separately so
 * the caller can reserve the final layout height up front (no jumping).
 */
export function useTypewriter(text: string, active: boolean, cps = 60) {
  const reduced = usePrefersReducedMotion();
  const chars = useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (reduced) {
      setCount(chars.length);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 2;
      setCount(Math.min(i, chars.length));
      if (i >= chars.length) window.clearInterval(id);
    }, 1000 / (cps / 2));
    return () => window.clearInterval(id);
  }, [active, reduced, chars, cps]);

  return {
    typed: chars.slice(0, count).join(""),
    rest: chars.slice(count).join(""),
    done: count >= chars.length,
  };
}
