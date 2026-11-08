"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";
import { Briefcase, Dices, Skull, Volume2, VolumeX, X } from "lucide-react";
import Backdrop from "./Backdrop";
import DiyaRow from "./Diya";
import Fireworks, { type FxHandle } from "./Fireworks";
import Rangoli from "./Rangoli";
import ShareRow from "./ShareRow";
import { usePrefersReducedMotion, useTypewriter } from "@/lib/hooks";
import { playBoom, playChime } from "@/lib/sound";
import {
  CORPORATE_WISHES,
  MAIN_BODY,
  MAIN_CLOSING,
  MAIN_SHARE,
  MAIN_TITLE,
  MISSION_ITEMS,
  RANDOM_WISHES,
  SAVAGE_WISHES,
} from "@/lib/wishes";

type Mode = "random" | "corporate" | "savage";
type Stage = "intro" | "leaving" | "main";

const LISTS: Record<Mode, string[]> = {
  random: RANDOM_WISHES,
  corporate: CORPORATE_WISHES,
  savage: SAVAGE_WISHES,
};

const MODE_LABEL: Record<Mode, string> = {
  random: "Classic chaos",
  corporate: "Corporate mode",
  savage: "Savage mode",
};

export default function DiwaliApp() {
  const fx = useRef<FxHandle>(null);
  const reduced = usePrefersReducedMotion();

  const [stage, setStage] = useState<Stage>("intro");
  const [step, setStep] = useState(0);
  const [muted, setMuted] = useState(false);

  const [mode, setMode] = useState<Mode>("random");
  const [wish, setWish] = useState<string | null>(null);
  const [savageSeen, setSavageSeen] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const [missionDone, setMissionDone] = useState(false);
  const [egg, setEgg] = useState(false);

  const timers = useRef<number[]>([]);
  const toastTimer = useRef<number | null>(null);
  const bags = useRef<Record<Mode, number[]>>({ random: [], corporate: [], savage: [] });
  const last = useRef<Record<Mode, number>>({ random: -1, corporate: -1, savage: -1 });

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    const t = timers.current;
    return () => {
      t.forEach((id) => window.clearTimeout(id));
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const sfx = useCallback(
    (kind: "boom" | "chime") => {
      if (muted) return;
      if (kind === "boom") playBoom();
      else playChime();
    },
    [muted],
  );

  // Intro: reveal the three lines one by one, then the button — all within ~4.5s.
  useEffect(() => {
    if (reduced) {
      setStep(4);
      return;
    }
    const ids = [500, 1900, 3300, 4300].map((ms, i) => window.setTimeout(() => setStep(i + 1), ms));
    const fireIds = [900, 2500].map((ms) => window.setTimeout(() => fx.current?.burst(), ms));
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
      fireIds.forEach((id) => window.clearTimeout(id));
    };
  }, [reduced]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const enter = () => {
    if (stage !== "intro") return;
    setStage("leaving");
    sfx("boom");
    fx.current?.finale(1800);
    fx.current?.confetti();
    later(() => {
      setStage("main");
      window.scrollTo({ top: 0 });
    }, reduced ? 0 : 1000);
  };

  const nextWish = (m: Mode): string => {
    const list = LISTS[m];
    if (bags.current[m].length === 0) {
      const idx = list.map((_, i) => i);
      for (let i = idx.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [idx[i], idx[j]] = [idx[j], idx[i]];
      }
      const n = idx.length;
      if (n > 1 && idx[n - 1] === last.current[m]) {
        [idx[0], idx[n - 1]] = [idx[n - 1], idx[0]];
      }
      bags.current[m] = idx;
    }
    const i = bags.current[m].pop() as number;
    last.current[m] = i;
    return list[i];
  };

  const generate = (m: Mode, e: MouseEvent<HTMLButtonElement>) => {
    fx.current?.burst(e.clientX, e.clientY, 0.6);
    sfx("chime");
    setMode(m);
    if (m === "savage" && !savageSeen) {
      setSavageSeen(true);
      setWish(null);
      later(() => {
        setWish(nextWish("savage"));
        fx.current?.burst(undefined, undefined, 0.8);
      }, reduced ? 0 : 1400);
      return;
    }
    setWish(nextWish(m));
  };

  const completeMission = (e: MouseEvent<HTMLButtonElement>) => {
    setMissionDone(true);
    sfx("chime");
    fx.current?.confetti();
    fx.current?.burst(e.clientX, e.clientY, 0.9);
  };

  const eggBoom = () => {
    fx.current?.finale(4500, true);
    fx.current?.confetti();
    if (!muted && !reduced) {
      for (let i = 0; i < 9; i++) later(() => playBoom(0.1), i * 420);
    } else {
      sfx("boom");
    }
    later(() => setEgg(true), reduced ? 0 : 1500);
  };

  const sparkle = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    fx.current?.burst(e.clientX, e.clientY, 0.25);
  };

  const { typed, rest, done: typingDone } = useTypewriter(MAIN_BODY, stage === "main");

  return (
    <main className="relative min-h-dvh">
      <Backdrop />
      <Fireworks ref={fx} />

      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        aria-pressed={!muted}
        className="glass fixed right-3 z-[70] grid size-11 place-items-center rounded-full text-amber-200 transition active:scale-95"
        style={{ top: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
      </button>

      {stage !== "main" ? (
        <section
          className={`relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 pb-44 pt-16 text-center transition-all duration-700 ${
            stage === "leaving" ? "scale-105 opacity-0 blur-sm" : ""
          }`}
        >
          <h1 className="animate-fade-up font-display text-[2.55rem] leading-[1.05] sm:text-7xl">
            ✨ <span className="gold-text">HAPPY DIWALI</span> ✨
          </h1>
          <p className="mt-3 max-w-md animate-fade-up text-[15px] text-amber-100/70 [animation-delay:.25s]">
            A completely unnecessary but highly festive Diwali experience. 😂
          </p>

          <div className="mt-10 max-w-lg space-y-4 font-display text-[1.3rem] leading-snug sm:text-2xl">
            <p className={step >= 1 ? "animate-fade-up text-amber-50" : "opacity-0"}>
              “May your life be brighter than your Diwali lights…”
            </p>
            <p className={step >= 2 ? "animate-fade-up text-amber-200" : "opacity-0"}>
              “…your happiness louder than the crackers…” 💥
            </p>
            <p className={step >= 3 ? "animate-fade-up text-amber-300" : "opacity-0"}>
              “…and your workload quieter than your boss on Diwali leave.” 😂
            </p>
          </div>

          <button
            type="button"
            onClick={enter}
            disabled={step < 4}
            className={`btn btn-gold mt-10 max-w-xs ${step >= 4 ? "animate-pop" : "pointer-events-none opacity-0"}`}
          >
            🪔 ENTER THE DIWALI ZONE
          </button>

          <div className="absolute inset-x-0 bottom-8">
            <DiyaRow bright={stage === "leaving"} />
          </div>
        </section>
      ) : (
        <div
          className="relative z-10 mx-auto w-full max-w-xl px-4 pb-20 pt-16 sm:pt-20"
          onPointerDown={sparkle}
        >
          <div className="mb-8 animate-fade-up">
            <DiyaRow bright compact />
          </div>

          {/* Main greeting card */}
          <article className="glass relative animate-card-in overflow-hidden rounded-[28px] p-6 sm:p-9">
            <Rangoli className="pointer-events-none absolute -right-16 -top-16 w-48 text-amber-300 opacity-[0.12]" />
            <Rangoli className="pointer-events-none absolute -bottom-20 -left-20 w-52 text-amber-300 opacity-[0.1]" />

            <h2 className="relative text-center font-display text-[1.7rem] leading-tight sm:text-4xl">
              🪔 <span className="gold-text">{MAIN_TITLE}</span> 🪔
            </h2>

            <p className="relative mt-6 whitespace-pre-line text-[17px] leading-relaxed text-amber-50/95 sm:text-lg">
              <span className="sr-only">{MAIN_BODY}</span>
              <span aria-hidden="true">
                {typed}
                <span className="opacity-0">{rest}</span>
              </span>
            </p>

            <p className={`relative mt-6 font-display text-xl leading-snug sm:text-2xl ${typingDone ? "animate-fade-up" : "opacity-0"}`}>
              <span className="gold-text">{MAIN_CLOSING}</span> 🎆
            </p>

            <div className={`relative ${typingDone ? "animate-fade-up" : "pointer-events-none opacity-0"}`}>
              <ShareRow text={MAIN_SHARE} onToast={showToast} />
            </div>
          </article>

          {/* Wish generator */}
          <section className="mt-12">
            <h2 className="text-center font-display text-[1.9rem] sm:text-4xl">
              🎲 <span className="gold-text">Need Another Wish?</span>
            </h2>
            <p className="mt-2 text-center text-sm text-amber-100/60">Fresh jokes, zero effort. Tap away.</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" className="btn btn-gold col-span-2" onClick={(e) => generate("random", e)}>
                <Dices size={20} aria-hidden="true" /> SURPRISE ME 😂
              </button>
              <button
                type="button"
                className={`btn btn-glass ${mode === "corporate" ? "btn-active" : ""}`}
                onClick={(e) => generate("corporate", e)}
              >
                <Briefcase size={18} aria-hidden="true" /> CORPORATE DIWALI MODE
              </button>
              <button
                type="button"
                className={`btn btn-glass ${mode === "savage" ? "btn-active" : ""}`}
                onClick={(e) => generate("savage", e)}
              >
                <Skull size={18} aria-hidden="true" /> UNLOCK SAVAGE DIWALI
              </button>
            </div>

            {mode === "savage" && (
              <div
                role="alert"
                className="mt-4 animate-pop rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-center text-sm font-semibold leading-snug text-red-100"
              >
                ⚠️ Warning: May cause uncontrollable forwarding in office WhatsApp groups. 😂
              </div>
            )}

            <div className="glass mt-4 min-h-[176px] rounded-3xl p-6" aria-live="polite">
              {wish ? (
                <div key={wish} className="animate-fade-up">
                  <span className="inline-block rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200">
                    {MODE_LABEL[mode]}
                  </span>
                  <p className="mt-4 text-[19px] leading-relaxed text-amber-50">{wish}</p>
                  <ShareRow text={wish} onToast={showToast} />
                </div>
              ) : (
                <p className="grid min-h-[128px] place-items-center text-center text-[15px] text-amber-100/55">
                  {mode === "savage" && savageSeen
                    ? "Brace yourself… 🔥"
                    : "Tap a button above and let the wishes begin. 🪔"}
                </p>
              )}
            </div>
          </section>

          {/* Mission */}
          <section className="glass mt-12 rounded-3xl p-6 sm:p-8">
            <h2 className="text-center font-display text-[1.9rem] sm:text-4xl">
              <span className="gold-text">Your Diwali Mission</span>
            </h2>
            <ul className="mt-5 space-y-3">
              {MISSION_ITEMS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.05] px-4 py-3 text-[16px] leading-snug"
                >
                  <span aria-hidden="true">✅</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {missionDone ? (
              <div className="mt-6 animate-pop rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-5 text-center" role="status">
                <p className="font-display text-2xl">MISSION ACCOMPLISHED 🫡</p>
                <p className="mt-1 text-amber-100/80">“Now go enjoy your Diwali.”</p>
              </div>
            ) : (
              <button type="button" className="btn btn-gold mt-6" onClick={completeMission}>
                🪔 COMPLETE MY DIWALI MISSION
              </button>
            )}
          </section>

          {/* Footer */}
          <footer className="mt-14 text-center">
            <DiyaRow bright compact />
            <p className="mt-6 text-sm text-amber-100/70">Made with 🪔 ❤️ and questionable amounts of caffeine.</p>
            <p className="mt-1 text-sm font-semibold text-amber-200">Happy Diwali — now go eat something sweet. 😂</p>
            <button
              type="button"
              onClick={eggBoom}
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-xs tracking-[0.2em] text-amber-100/35 transition hover:text-amber-100/90 focus-visible:text-amber-100/90"
            >
              🧨 DON&apos;T PRESS THIS
            </button>
          </footer>
        </div>
      )}

      {/* Easter egg message */}
      {egg && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Easter egg"
          className="fixed inset-0 z-[55] grid place-items-center bg-black/60 px-5"
          onClick={() => setEgg(false)}
        >
          <div className="glass relative w-full max-w-sm animate-pop rounded-3xl p-7 text-center" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setEgg(false)}
              aria-label="Close"
              className="absolute right-3 top-3 grid size-10 place-items-center rounded-full text-amber-100/70 transition hover:text-amber-100"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <p className="text-4xl" aria-hidden="true">🧨</p>
            <p className="mt-3 font-display text-2xl leading-snug">
              <span className="gold-text">Congratulations. You just used 5 seconds of productivity.</span>
            </p>
            <p className="mt-4 text-lg font-semibold text-amber-100">Happy Diwali! 😂🪔</p>
            <button type="button" className="btn btn-gold mt-6" onClick={() => setEgg(false)}>
              BACK TO THE SWEETS
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-4 z-[80] mx-auto max-w-sm animate-pop rounded-2xl border border-amber-300/40 bg-[#1a1208]/95 px-5 py-3.5 text-center text-sm font-semibold text-amber-100 shadow-2xl"
          style={{ bottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
        >
          {toast}
        </div>
      )}
    </main>
  );
}
