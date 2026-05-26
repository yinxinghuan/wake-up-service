import type { ReactNode } from 'react';
import Watermark from './Watermark';

/** Bezel + LCD panel wrapper. Children render inside the LCD. */
export default function LCDFrame({ children }: { children: ReactNode }) {
  return (
    <div className="wus-device">
      <div className="wus-lcd">
        {children}
        <Watermark />
      </div>
    </div>
  );
}
