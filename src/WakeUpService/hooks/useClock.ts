import { useEffect, useState } from 'react';

/**
 * Subscribe to a wall-clock Date that ticks at 1Hz.
 *
 * Uses requestAnimationFrame instead of setInterval — preload-safety rule:
 * games are loaded in the background while the user is still on the previous
 * game, and rogue intervals leak. rAF naturally pauses when the tab hides,
 * and we can cancel it cleanly on unmount.
 */
export function useClock(): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    let raf = 0;
    let lastSecond = Math.floor(Date.now() / 1000);

    const tick = () => {
      const s = Math.floor(Date.now() / 1000);
      if (s !== lastSecond) {
        lastSecond = s;
        setNow(new Date());
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return now;
}
