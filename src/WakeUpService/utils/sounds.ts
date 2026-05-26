// Web Audio synth — never plays a file, never resumes on mount.
// First-touch unlock pattern (memory rule: audio init only on first pointerdown).

let audioCtx: AudioContext | null = null;
let unlocked = false;

const getCtx = (): AudioContext | null => {
  try {
    if (!audioCtx) {
      const Ctor: typeof AudioContext | undefined =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    return audioCtx;
  } catch {
    return null;
  }
};

/** Call exactly once from the first onPointerDown branch in the app. */
export function unlockAudio(): void {
  if (unlocked) return;
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  unlocked = true;
}

interface ToneOpts {
  type?: OscillatorType;
  gain?: number;
  freqEnd?: number;
  gainEnd?: number;
  delay?: number;
}

function tone(freq: number, duration: number, opts: ToneOpts = {}): void {
  try {
    const ctx = getCtx();
    if (!ctx || !unlocked) return;
    const now = ctx.currentTime + (opts.delay || 0);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(freq, now);
    if (opts.freqEnd) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(opts.freqEnd, 1),
        now + duration,
      );
    }
    g.gain.setValueAtTime(opts.gain ?? 0.06, now);
    g.gain.exponentialRampToValueAtTime(
      Math.max(opts.gainEnd ?? 0.001, 0.0001),
      now + duration,
    );
    osc.connect(g).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch {
    /* ignore */
  }
}

function noise(duration: number, gain = 0.04): void {
  try {
    const ctx = getCtx();
    if (!ctx || !unlocked) return;
    const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    src.connect(g).connect(ctx.destination);
    src.start();
  } catch {
    /* ignore */
  }
}

// ─── Sound vocabulary ──────────────────────────────────────────────────────

/** Generic UI tap — short blip. */
export function playClick(): void {
  tone(680, 0.04, { type: 'square', gain: 0.04, freqEnd: 420 });
}

/** Selection confirmed — two-tone up. */
export function playSelect(): void {
  tone(520, 0.05, { type: 'square', gain: 0.05 });
  tone(880, 0.07, { type: 'square', gain: 0.05, delay: 0.04 });
}

/** Single dial-ring tick (3 of these during dialing). */
export function playRing(): void {
  tone(820, 0.18, { type: 'sine', gain: 0.06, freqEnd: 720 });
  tone(660, 0.18, { type: 'sine', gain: 0.05, delay: 0.05, freqEnd: 580 });
}

/** Theme/font shifted — soft swoosh. */
export function playShift(): void {
  tone(380, 0.18, { type: 'sine', gain: 0.04, freqEnd: 760 });
}

/** Stamp slam — low thud + brief noise burst. */
export function playStamp(): void {
  tone(110, 0.18, { type: 'sine', gain: 0.10, freqEnd: 60 });
  noise(0.12, 0.05);
}

/** Wake-up dispatched — 4-tone fanfare. */
export function playComplete(): void {
  tone(523, 0.10, { type: 'square', gain: 0.05 }); // C
  tone(659, 0.10, { type: 'square', gain: 0.05, delay: 0.10 }); // E
  tone(784, 0.10, { type: 'square', gain: 0.05, delay: 0.20 }); // G
  tone(1047, 0.22, { type: 'square', gain: 0.06, delay: 0.30 }); // C
}

/** Back / cancel — single low blip. */
export function playBack(): void {
  tone(360, 0.05, { type: 'square', gain: 0.04, freqEnd: 260 });
}
