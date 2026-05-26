import type { ReactNode } from 'react';
import { GearIcon } from '../utils/icons';
import { playClick } from '../utils/sounds';

interface SysProps {
  cells: { k: string; v?: ReactNode }[];
  onGear?: () => void;
  gearLabel?: string;
}

/** Footer status row. Optional gear button on the right. */
export default function Sys({ cells, onGear, gearLabel = 'DISPLAY' }: SysProps) {
  return (
    <div className="wus-sys">
      {cells.map((c, i) => (
        <span key={i}>
          {c.k}
          {c.v != null ? (
            <>
              {' '}
              <b>{c.v}</b>
            </>
          ) : null}
        </span>
      ))}
      {onGear && (
        <button
          className="wus-sys__gear"
          onPointerDown={(e) => {
            e.preventDefault();
            playClick();
            onGear();
          }}
        >
          <GearIcon size={11} />
          {gearLabel}
        </button>
      )}
    </div>
  );
}
