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

export interface Method {
  id: MethodId;
  /** 01-06 — used for the LCD `[NN]` column */
  num: string;
  name: string;
  shortName: string;
  desc: string;
  icon: 'drum' | 'cat' | 'bucket' | 'megaphone' | 'phone' | 'rooster';
  /** AI-image prompt fragment for the notify ref_image */
  prompt: string;
  /** Optional override ref image URL for img2img; empty = text-to-image */
  refUrl: string;
  /** Message template fed to platform notify */
  messageTemplate: string;
  /** verb used on the dialing screen "<verb> EN ROUTE" */
  dialVerb: string;
}
