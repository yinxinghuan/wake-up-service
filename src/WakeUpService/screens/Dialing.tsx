import { useEffect, useRef, useState } from 'react';
import { useGameEvent } from '@shared/runtime';
import LEDPhoto from '../components/LEDPhoto';
import Strip from '../components/Strip';
import Sys from '../components/Sys';
import type { AigramContact, MethodSpec } from '../types';
import { playRing, playStamp, playComplete } from '../utils/sounds';
import { useLocale } from '../i18n';

interface DialingProps {
  target: AigramContact;
  method: MethodSpec;
  onComplete: () => void;
}

type Phase = 'dialing' | 'connected' | 'stamping' | 'delivered';

const PHASE_TIMINGS: Record<Phase, number> = {
  dialing: 400,
  connected: 1600,
  stamping: 600,
  delivered: 900,
};

export default function Dialing({ target, method, onComplete }: DialingProps) {
  const { t } = useLocale();
  const [phase, setPhase] = useState<Phase>('dialing');
  const { trigger, canEmit } = useGameEvent();
  const firedRef = useRef(false);

  // Fire ONCE on mount with the localized notify payload.
  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const messageTemplate = t(`method.${method.id}.msg`);

    // Spec: image is optional, but if present BOTH ref_url and prompt are
    // required. Drop image entirely when we have no ref frame for the method.
    const action: Record<string, unknown> = {
      type: 'notify',
      target_user_id: target.telegram_id,
      message: {
        template: messageTemplate,
        variables: ['sender_name'],
      },
    };
    if (method.refUrl) {
      action.image = { ref_url: method.refUrl, prompt: method.prompt };
    }
    trigger('wakeup_sent', { actions: [action] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Choreograph 3.5s of phases + audio cues
  useEffect(() => {
    const timers: number[] = [];

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
  const dialVerb = t(`method.${method.id}.dial`);

  return (
    <>
      <Strip status={t('strip.dispatching')} right="RNG · 04" />

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
          <small>{t('dial.room_label')}</small>
        </div>

        {showRingbars && (
          <div className="wus-ringbars">
            <span /><span /><span /><span /><span /><span /><span />
          </div>
        )}

        <div className="wus-dial-msg">
          {phase === 'dialing' && t('dial.dialing')}
          {phase === 'connected' && t('dial.enroute', { verb: dialVerb })}
          {showStamp && t('dial.delivered', { verb: dialVerb })}
        </div>

        <div className="wus-dial-meta">
          {t('dial.payload')}<br />
          {t('dial.signal')}
        </div>

        {showStamp && (
          <div
            className={`wus-stamp${!canEmit ? ' wus-stamp--demo' : ''}`}
            key={phase}
          >
            {canEmit ? t('dial.stamp.sent') : t('dial.stamp.test')}
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
