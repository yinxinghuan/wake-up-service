import type { Method } from '../types';

export const METHODS: Method[] = [
  {
    id: 'marching_band',
    num: '01',
    name: 'MARCHING  BAND',
    shortName: 'BAND',
    desc: 'BRASS @ 110 DB · DIRECT TO EAR',
    icon: 'drum',
    prompt:
      'a marching band with brass trumpets and snare drums playing directly into a sleeping person ear, chaotic, comic illustration',
    refUrl: '',
    messageTemplate: '{sender_name} sent a marching band into your bedroom',
    dialVerb: 'BRASS  BAND',
  },
  {
    id: 'cats',
    num: '02',
    name: 'ONE  HUNDRED  CATS',
    shortName: 'CATS',
    desc: 'LICK SWARM · FELINE ASSAULT',
    icon: 'cat',
    prompt:
      'a sleeping person being smothered by one hundred cats licking their face, absurd cartoon, comic illustration',
    refUrl: '',
    messageTemplate: '{sender_name} dispatched 100 cats to lick you awake',
    dialVerb: '100  CATS',
  },
  {
    id: 'water',
    num: '03',
    name: 'BUCKET  OF  WATER',
    shortName: 'WATER',
    desc: 'SUB-ZERO · GRAVITY ASSISTED',
    icon: 'bucket',
    prompt:
      'a sleeping person drenched by a bucket of ice cold water poured from above, dramatic splash, comic illustration',
    refUrl: '',
    messageTemplate: '{sender_name} dumped an ice bucket on you',
    dialVerb: 'ICE  BUCKET',
  },
  {
    id: 'sergeant',
    num: '04',
    name: 'DRILL  SERGEANT',
    shortName: 'SARGE',
    desc: '2 IN. RANGE · ALL-CAPS',
    icon: 'megaphone',
    prompt:
      'a drill sergeant screaming inches from a sleeping person face, military illustration, comic style',
    refUrl: '',
    messageTemplate: '{sender_name} sent a drill sergeant to your bedside',
    dialVerb: 'DRILL  SARGE',
  },
  {
    id: 'robocall',
    num: '05',
    name: 'ROBOCALL  STORM',
    shortName: 'CALLS',
    desc: 'LANDLINE FLOOD · 50× RING',
    icon: 'phone',
    prompt:
      'a sleeping person buried under fifty ringing landline telephones, all phones ringing at once, comic illustration',
    refUrl: '',
    messageTemplate: '{sender_name} called you 50 times in a row',
    dialVerb: 'ROBOCALL  STORM',
  },
  {
    id: 'rooster',
    num: '06',
    name: 'ROOSTER  CHOIR',
    shortName: 'ROOSTER',
    desc: '10× CHEST-MOUNTED',
    icon: 'rooster',
    prompt:
      'ten roosters perched on a sleeping person chest crowing at sunrise, absurd cartoon, comic illustration',
    refUrl: '',
    messageTemplate: '{sender_name} parked 10 roosters on your chest',
    dialVerb: 'ROOSTER  CHOIR',
  },
];

export function getMethod(id: string | null): Method | null {
  if (!id) return null;
  return METHODS.find((m) => m.id === id) ?? null;
}
