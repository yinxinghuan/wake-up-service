import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ThemeColor, ThemeFont } from './types';
import { THEME_COLORS, THEME_FONTS } from './types';

const LS_THEME = 'wakeup_theme';
const LS_FONT = 'wakeup_font';
const LS_BRIGHT = 'wakeup_brightness';
const PERSIST_DEBOUNCE = 200;

const DEFAULT_COLOR: ThemeColor = 'crimson';
const DEFAULT_FONT: ThemeFont = 'crt';
const DEFAULT_BRIGHT = 4; // 0..6

interface ThemeCtx {
  color: ThemeColor;
  font: ThemeFont;
  brightness: number;
  setColor: (c: ThemeColor) => void;
  setFont: (f: ThemeFont) => void;
  setBrightness: (b: number) => void;
  reset: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

function readLS<T>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v && (allowed as readonly unknown[]).includes(v)) return v as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

function readBrightness(): number {
  try {
    const v = parseInt(localStorage.getItem(LS_BRIGHT) ?? '', 10);
    if (Number.isFinite(v) && v >= 0 && v <= 6) return v;
  } catch {
    /* ignore */
  }
  return DEFAULT_BRIGHT;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [color, setColorState] = useState<ThemeColor>(() =>
    readLS<ThemeColor>(LS_THEME, THEME_COLORS, DEFAULT_COLOR),
  );
  const [font, setFontState] = useState<ThemeFont>(() =>
    readLS<ThemeFont>(LS_FONT, THEME_FONTS, DEFAULT_FONT),
  );
  const [brightness, setBrightnessState] = useState<number>(readBrightness);

  // Debounced LS write
  const timersRef = useRef<Record<string, number>>({});
  const persist = useCallback((key: string, value: string) => {
    const prev = timersRef.current[key];
    if (prev) window.clearTimeout(prev);
    timersRef.current[key] = window.setTimeout(() => {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* ignore */
      }
    }, PERSIST_DEBOUNCE);
  }, []);

  const setColor = useCallback(
    (c: ThemeColor) => {
      setColorState(c);
      persist(LS_THEME, c);
    },
    [persist],
  );
  const setFont = useCallback(
    (f: ThemeFont) => {
      setFontState(f);
      persist(LS_FONT, f);
    },
    [persist],
  );
  const setBrightness = useCallback(
    (b: number) => {
      const clamped = Math.max(0, Math.min(6, Math.round(b)));
      setBrightnessState(clamped);
      persist(LS_BRIGHT, String(clamped));
    },
    [persist],
  );
  const reset = useCallback(() => {
    setColor(DEFAULT_COLOR);
    setFont(DEFAULT_FONT);
    setBrightness(DEFAULT_BRIGHT);
  }, [setColor, setFont, setBrightness]);

  useEffect(
    () => () => {
      // Flush any pending writes on unmount
      for (const key of Object.keys(timersRef.current)) {
        const t = timersRef.current[key];
        if (t) window.clearTimeout(t);
      }
    },
    [],
  );

  const value = useMemo<ThemeCtx>(
    () => ({ color, font, brightness, setColor, setFont, setBrightness, reset }),
    [color, font, brightness, setColor, setFont, setBrightness, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTheme(): ThemeCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('useTheme must be used inside <ThemeProvider>');
  return v;
}
