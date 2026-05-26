import { useEffect, useRef, useState } from 'react';
import { useGameEvent } from '@shared/runtime';
import LEDPhoto from '../components/LEDPhoto';
import Strip from '../components/Strip';
import Sys from '../components/Sys';
import type { AigramContact, Method } from '../types';
import { playRing, playStamp, playComplete } from '../utils/sounds';

interface DialingProps {
  target: AigramContact;
  method: Method;
  onComplete: () => void;
}

type Phase = 'dialing' | 'connected' | 'stamping' | 'delivered';

const PHASE_TIMINGS: Record<Phase, number> = {
  dialing: 400,     // 0.0–0.4 "DIALING…"
  connected: 1600,  // 0.4–2.0 ringbars + 3 ring ticks
  stamping: 600,    // 2.0–2.6 stamp slam
  delivered: 900,   // 2.6–3.5 hold
};

export default function Dialing({ target, method, onComplete }: DialingProps) {
  const [phase, setPhase] = useState<Phase>('dialing');
  const { trigger, canEmit } = useGameEvent();
  const firedRef = useRef(false);

  // Build the notify config + fire ONCE on mount.
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const config = {
      actions: [
        {
          type: 'notify',
          target_user_id: target.telegram_id,
          image: method.refUrl
            ? { ref_url: method.refUrl, prompt: method.prompt }
            : { prompt: method.prompt },
          message: {
            template: method.messageTemplate,
            variables: ['sender_name'],
          },
        },
      ],
    };
    trigger('wakeup_sent', config);
  }, [target.telegram_id, method, trigger]);

  // Choreograph 3.5s of phases + audio cues
  useEffect(() => {
    const timers: number[] = [];

    // ring ticks during connected phase
    timers.push(window.setTimeout(() => playRing(), 600));
    timers.push(window.setTimeout(() => playRing(), 1100));
    timers.push(window.setTimeout(() => playRing(), 1600));

    timers.push(
      window.setTimeout(() => setPhase('connected'), PHASE_TIMINGS.dialing),
    );
    timers.push(
      window.setTimeout(() => {
        playStamp();
        setPhase('stamping');
      }, PHASE_TIMINGS.dialing + PHASE_TIMINGS.connected),
    );
    timers.push(
      window.setTimeout(() => {
        playComplete();
        setPhase('delivered');
      }, PHASE_TIMINGS.dialing + PHASE_TIMINGS.connected + PHASE_TIMINGS.stamping),
    );
    timers.push(
      window.setTimeout(
        () => onComplete(),
        PHASE_TIMINGS.dialing +
          PHASE_TIMINGS.connected +
          PHASE_TIMINGS.stamping +
          PHASE_TIMINGS.delivered,
      ),
    );

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showStamp = phase === 'stamping' || phase === 'delivered';
  const showRingbars = phase === 'dialing' || phase === 'connected';

  return (
    <>
      <Strip status="DISPATCHING" right="RNG · 04" />

      <div className="wus-dial-stage">
        <div className="wus-dial-portrait">
          <LEDPhoto
            src={target.head_url}
            fallback={target.name}
            size="md"
            alt={target.name}
          />
        </div>

        <div className="wus-dial-target">
          {target.name.toUpperCase()}
          <small>SLEEPER · ROOM 3A</small>
        </div>

        {showRingbars && (
          <div className="wus-ringbars">
            <span /><span /><span /><span /><span /><span /><span />
          </div>
        )}

        <div className="wus-dial-msg">
          {phase === 'dialing' && 'DIALING…'}
          {phase === 'connected' && `${method.dialVerb}  ENROUTE`}
          {showStamp && `${method.dialVerb}  DELIVERED`}
        </div>

        <div className="wus-dial-meta">
          PAYLOAD · 1.2 MB UPLOADED<br />
          SIGNAL · 4 BARS · EST. 0:03
        </div>

        {showStamp && (
          <div
            className={`wus-stamp${!canEmit ? ' wus-stamp--demo' : ''}`}
            key={phase /* re-trigger anim if phase changes */}
          >
            {canEmit ? 'SIGNAL DISPATCHED' : 'LOCAL TEST ONLY'}
          </div>
        )}
      </div>

      <Sys
        cells={[
          { k: 'OP', v: 'YOU' },
          { k: 'TGT', v: target.name.toUpperCase() },
          { k: 'P', v: method.num },
        ]}
      />
    </>
  );
}
