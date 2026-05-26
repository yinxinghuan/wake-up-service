// All glyphs as monochrome SVG using currentColor — memory rule: no emoji in UI.

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function svg(size: number, viewBox = '0 0 24 24'): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
}

export function GearIcon({ size = 16, ...rest }: IconProps) {
  return (
    <svg {...svg(size)} {...rest}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  );
}

export function BackIcon({ size = 12, ...rest }: IconProps) {
  return (
    <svg {...svg(size)} {...rest}>
      <path d="M15 4 8 12l7 8" />
    </svg>
  );
}

export function ChevronRight({ size = 12, ...rest }: IconProps) {
  return (
    <svg {...svg(size)} {...rest}>
      <path d="M9 4l7 8-7 8" />
    </svg>
  );
}

// ─── Method icons ──────────────────────────────────────────────────────────

export function DrumIcon({ size = 18, ...rest }: IconProps) {
  return (
    <svg {...svg(size)} {...rest}>
      <ellipse cx="12" cy="7" rx="8" ry="2.5" />
      <path d="M4 7v9c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V7" />
      <path d="M4 12c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5" />
      <path d="m16 4 4-2M8 4 4 2" />
    </svg>
  );
}

export function CatIcon({ size = 18, ...rest }: IconProps) {
  return (
    <svg {...svg(size)} {...rest}>
      <path d="M4 11l-1-5 4 3M20 11l1-5-4 3" />
      <path d="M5 11c0-3.5 3.1-6 7-6s7 2.5 7 6v5c0 2.2-3.1 4-7 4s-7-1.8-7-4z" />
      <circle cx="9.5" cy="12" r="0.6" fill="currentColor" />
      <circle cx="14.5" cy="12" r="0.6" fill="currentColor" />
      <path d="M11 15h2M12 15v1.5" />
    </svg>
  );
}

export function BucketIcon({ size = 18, ...rest }: IconProps) {
  return (
    <svg {...svg(size)} {...rest}>
      <path d="M5 8h14l-1.5 12.5a1 1 0 0 1-1 .9H7.5a1 1 0 0 1-1-.9z" />
      <path d="M8 6c0-1.6 1.8-3 4-3s4 1.4 4 3" />
      <path d="M5 8h14" />
    </svg>
  );
}

export function MegaphoneIcon({ size = 18, ...rest }: IconProps) {
  return (
    <svg {...svg(size)} {...rest}>
      <path d="M3 11v3l13 5V6z" />
      <path d="M16 8a4 4 0 0 1 0 8" />
      <path d="M5 14h3l1 6H6z" />
    </svg>
  );
}

export function PhoneIcon({ size = 18, ...rest }: IconProps) {
  return (
    <svg {...svg(size)} {...rest}>
      <path d="M5 4c4-1 6-1 10 0l-1 4-3 1-2 4 2 4 3 1 1 4c-4 1-6 1-10 0z" />
      <path d="M3 2l2 2M21 2l-2 2M3 22l2-2M21 22l-2-2" />
    </svg>
  );
}

export function RoosterIcon({ size = 18, ...rest }: IconProps) {
  return (
    <svg {...svg(size)} {...rest}>
      <path d="M8 3v3M10 2v4M12 3v3" />
      <path d="M6 8c0-1 1-2 3-2s5 1 6 3l3 1-1 3-2 1 1 3-4 2H8c-3 0-5-2-5-5 0-2 1-4 3-5z" />
      <circle cx="9" cy="10" r="0.7" fill="currentColor" />
      <path d="m13 10 3-1" />
    </svg>
  );
}

export function methodIcon(name: string): (props: IconProps) => JSX.Element {
  switch (name) {
    case 'drum':      return DrumIcon;
    case 'cat':       return CatIcon;
    case 'bucket':    return BucketIcon;
    case 'megaphone': return MegaphoneIcon;
    case 'phone':     return PhoneIcon;
    case 'rooster':   return RoosterIcon;
    default:          return DrumIcon;
  }
}
