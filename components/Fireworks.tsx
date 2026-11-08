"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type FxHandle = {
  burst: (x?: number, y?: number, scale?: number) => void;
  confetti: () => void;
  finale: (ms?: number, intense?: boolean) => void;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
  confetti: boolean;
};

const PALETTE = ["#ffd166", "#ffb703", "#ff9f1c", "#ff6b35", "#ffe8a3", "#ff4d6d", "#ffffff"];
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const Fireworks = forwardRef<FxHandle>(function Fireworks(_props, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<FxHandle>({ burst() {}, confetti() {}, finale() {} });

  useImperativeHandle(
    ref,
    () => ({
      burst: (x, y, scale) => api.current.burst(x, y, scale),
      confetti: () => api.current.confetti(),
      finale: (ms, intense) => api.current.finale(ms, intense),
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const parts: Particle[] = [];
    const timers: number[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let running = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.667, 3);
      last = now;
      ctx.clearRect(0, 0, w, h);

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt;
        if (p.life >= p.max || p.y > h + 30) {
          parts.splice(i, 1);
          continue;
        }
        const k = p.life / p.max;

        if (p.confetti) {
          p.vx *= Math.pow(0.992, dt);
          p.vy = Math.min(p.vy + 0.06 * dt, 3.2);
          p.x += (p.vx + Math.sin(p.life * 0.08 + p.rot) * 0.6) * dt;
          p.y += p.vy * dt;
          p.rot += p.vr * dt;
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = k > 0.85 ? (1 - k) / 0.15 : 1;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        } else {
          const f = Math.pow(0.97, dt);
          p.vx *= f;
          p.vy = p.vy * f + 0.045 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = Math.max(0, 1 - k * k);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.2, p.size * (1 - k * 0.5)), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      if (parts.length) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        ctx.clearRect(0, 0, w, h);
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const burst = (x?: number, y?: number, scale = 1) => {
      if (parts.length > 1200) return;
      const small = w < 640;
      const cx = x ?? w * rand(0.15, 0.85);
      const cy = y ?? h * rand(0.12, 0.5);
      const base = mq.matches ? 18 : 64;
      const n = Math.round(base * scale * (small ? 0.75 : 1));
      const c1 = pick(PALETTE);
      const c2 = pick(PALETTE);
      const ring = Math.random() < 0.35;
      const speed = rand(3, 6) * (small ? 0.8 : 1) * (0.6 + 0.4 * Math.min(scale, 1.5));
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05);
        const v = ring ? speed : speed * rand(0.25, 1);
        parts.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v,
          life: 0,
          max: rand(55, 95),
          size: rand(1.2, 2.6) * (scale < 0.5 ? 0.8 : 1),
          color: Math.random() < 0.5 ? c1 : c2,
          rot: 0,
          vr: 0,
          confetti: false,
        });
      }
      start();
    };

    const confetti = () => {
      if (mq.matches) return;
      const n = w < 640 ? 70 : 130;
      for (let i = 0; i < n; i++) {
        parts.push({
          x: rand(0, w),
          y: rand(-40, -5),
          vx: rand(-1.2, 1.2),
          vy: rand(1, 3),
          life: 0,
          max: rand(220, 340),
          size: rand(6, 11),
          color: pick(PALETTE),
          rot: rand(0, Math.PI * 2),
          vr: rand(-0.2, 0.2),
          confetti: true,
        });
      }
      start();
    };

    const finale = (ms = 2000, intense = false) => {
      const end = performance.now() + ms;
      const tick = () => {
        const scale = intense ? 1.3 : 1;
        burst(undefined, undefined, scale);
        if (!mq.matches) {
          if (Math.random() < (intense ? 0.9 : 0.5)) burst(undefined, undefined, scale);
          if (intense && Math.random() < 0.5) burst(undefined, undefined, scale);
          if (performance.now() < end) {
            timers.push(window.setTimeout(tick, rand(110, 220)));
          }
        }
      };
      tick();
    };

    api.current = { burst, confetti, finale };

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
      api.current = { burst() {}, confetti() {}, finale() {} };
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-50" />;
});

export default Fireworks;
