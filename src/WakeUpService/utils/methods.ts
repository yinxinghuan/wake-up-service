// Method catalog — translation-free. Display strings come from i18n keys
// `method.<id>.{name,short,desc,dial,msg}`. The AI image prompt stays
// English (AI image API understands English best).

import type { MethodId } from '../types';

export interface MethodSpec {
  id: MethodId;
  /** 01-06 — fixed LCD column code */
  num: string;
  /** Icon registry key (see utils/icons.tsx) */
  icon: 'drum' | 'cat' | 'bucket' | 'megaphone' | 'phone' | 'rooster';
  /** Optional override ref image URL for img2img; empty = text-to-image */
  refUrl: string;
  /** AI image gen prompt — kept English regardless of UI locale */
  prompt: string;
}

export const METHODS: MethodSpec[] = [
  {
    id: 'marching_band',
    num: '01',
    icon: 'drum',
    refUrl: '',
    prompt:
      'a marching band with brass trumpets and snare drums playing directly into a sleeping person ear, chaotic, comic illustration',
  },
  {
    id: 'cats',
    num: '02',
    icon: 'cat',
    refUrl: '',
    prompt:
      'a sleeping person being smothered by one hundred cats licking their face, absurd cartoon, comic illustration',
  },
  {
    id: 'water',
    num: '03',
    icon: 'bucket',
    refUrl: '',
    prompt:
      'a sleeping person drenched by a bucket of ice cold water poured from above, dramatic splash, comic illustration',
  },
  {
    id: 'sergeant',
    num: '04',
    icon: 'megaphone',
    refUrl: '',
    prompt:
      'a drill sergeant screaming inches from a sleeping person face, military illustration, comic style',
  },
  {
    id: 'robocall',
    num: '05',
    icon: 'phone',
    refUrl: '',
    prompt:
      'a sleeping person buried under fifty ringing landline telephones, all phones ringing at once, comic illustration',
  },
  {
    id: 'rooster',
    num: '06',
    icon: 'rooster',
    refUrl: '',
    prompt:
      'ten roosters perched on a sleeping person chest crowing at sunrise, absurd cartoon, comic illustration',
  },
];

export function getMethodSpec(id: string | null): MethodSpec | null {
  if (!id) return null;
  return METHODS.find((m) => m.id === id) ?? null;
}
