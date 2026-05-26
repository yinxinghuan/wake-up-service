import type { ReactNode } from 'react';
import { BackIcon } from '../utils/icons';
import { playBack } from '../utils/sounds';

interface StripProps {
  /** Left-hand status label, e.g. "LIVE · ROOM 3A" */
  status: string;
  /** Right-hand readout, e.g. "SYS 03.47" */
  right?: ReactNode;
  /** Show back chip on the left */
  onBack?: () => void;
  /** Show "· DEMO ·" pill */
  demo?: boolean;
}

export default function Strip({ status, right, onBack, demo }: StripProps) {
  return (
    <div className="wus-strip">
      {onBack ? (
        <button
          className="wus-strip__back"
          onPointerDown={(e) => {
            e.preventDefault();
            playBack();
            onBack();
          }}
        >
          <BackIcon size={10} />
          BACK
        </button>
      ) : (
        <span className="wus-strip__lhs">
          <span className="wus-strip__dot" />
          {status}
        </span>
      )}
      {demo && <span className="wus-strip__demo">· DEMO ·</span>}
      <span>{right}</span>
    </div>
  );
}
