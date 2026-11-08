// Tiny synthesized sound effects (no audio files). Only ever triggered by a tap,
// so browsers' autoplay rules are respected.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function playBoom(volume = 0.14): void {
  const c = getCtx();
  if (!c) return;
  const len = Math.floor(c.sampleRate * 0.6);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, c.currentTime);
  filter.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.5);
  const gain = c.createGain();
  gain.gain.value = volume;
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
}

export function playChime(volume = 0.06): void {
  const c = getCtx();
  if (!c) return;
  const notes = [880, 1318.5];
  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    const t = c.currentTime + i * 0.09;
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.55);
  });
}
