import { timeDigits } from '../utils/time';

interface LEDClockProps {
  now: Date;
}

/**
 * 7-segment SVG clock. Each digit is composed of 7 segments, each segment
 * an SVG <use> referencing a horizontal or vertical bar symbol.
 *
 * Segments are bitmask-encoded per digit:
 *   bits = [top, TL, TR, mid, BL, BR, bottom]
 */
const DIGIT_BITS: Record<string, [number, number, number, number, number, number, number]> = {
  '0': [1, 1, 1, 0, 1, 1, 1],
  '1': [0, 0, 1, 0, 0, 1, 0],
  '2': [1, 0, 1, 1, 1, 0, 1],
  '3': [1, 0, 1, 1, 0, 1, 1],
  '4': [0, 1, 1, 1, 0, 1, 0],
  '5': [1, 1, 0, 1, 0, 1, 1],
  '6': [1, 1, 0, 1, 1, 1, 1],
  '7': [1, 0, 1, 0, 0, 1, 0],
  '8': [1, 1, 1, 1, 1, 1, 1],
  '9': [1, 1, 1, 1, 0, 1, 1],
};

function Digit({ x, value }: { x: number; value: string }) {
  const bits = DIGIT_BITS[value] || DIGIT_BITS['0'];
  const cls = (on: number) => (on ? 'wus-seg-on' : 'wus-seg-off');
  return (
    <g transform={`translate(${x},5)`}>
      <use href="#wus-seg-h" x="6"  y="0"  width="40" height="8"  className={cls(bits[0])} />
      <use href="#wus-seg-v" x="0"  y="6"  width="8"  height="36" className={cls(bits[1])} />
      <use href="#wus-seg-v" x="44" y="6"  width="8"  height="36" className={cls(bits[2])} />
      <use href="#wus-seg-h" x="6"  y="40" width="40" height="8"  className={cls(bits[3])} />
      <use href="#wus-seg-v" x="0"  y="44" width="8"  height="36" className={cls(bits[4])} />
      <use href="#wus-seg-v" x="44" y="44" width="8"  height="36" className={cls(bits[5])} />
      <use href="#wus-seg-h" x="6"  y="74" width="40" height="8"  className={cls(bits[6])} />
    </g>
  );
}

export default function LEDClock({ now }: LEDClockProps) {
  const [d0, d1, d2, d3] = timeDigits(now);
  return (
    <div className="wus-clock">
      <svg viewBox="0 0 280 90" aria-hidden="true">
        <defs>
          <symbol id="wus-seg-h" viewBox="0 0 40 8">
            <polygon points="2,4 6,0 36,0 40,4 36,8 6,8" />
          </symbol>
          <symbol id="wus-seg-v" viewBox="0 0 8 40">
            <polygon points="4,2 0,6 0,36 4,40 8,36 8,6" />
          </symbol>
        </defs>
        <Digit x={0}   value={d0} />
        <Digit x={60}  value={d1} />
        <g transform="translate(125,15)" className="wus-seg-on">
          <circle cx="6" cy="14" r="4" />
          <circle cx="6" cy="50" r="4" />
        </g>
        <Digit x={150} value={d2} />
        <Digit x={210} value={d3} />
      </svg>
    </div>
  );
}
