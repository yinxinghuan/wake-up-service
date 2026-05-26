export type ThemeColor = 'crimson' | 'amber' | 'phosphor' | 'cyan' | 'synth';
export type ThemeFont = 'crt' | 'pixel' | 'dot' | 'mono';

export const THEME_COLORS: ThemeColor[] = ['crimson', 'amber', 'phosphor', 'cyan', 'synth'];
export const THEME_FONTS: ThemeFont[] = ['crt', 'pixel', 'dot', 'mono'];

export type MethodId =
  | 'marching_band'
  | 'cats'
  | 'water'
  | 'sergeant'
  | 'robocall'
  | 'rooster';

export type FlowPhase =
  | 'picker'
  | 'detail'
  | 'method'
  | 'dialing'
  | 'receipt';

export type View = 'lobby' | 'flow' | 'settings';

export interface AigramContact {
  telegram_id: string;
  name: string;
  head_url: string;
}

/** Re-export of methods.ts MethodSpec for screen prop types. */
export type { MethodSpec } from './utils/methods';
