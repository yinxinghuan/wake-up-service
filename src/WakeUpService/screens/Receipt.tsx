import { useEffect, useState } from 'react';
import { useGameEvent } from '@shared/runtime';
import Strip from '../components/Strip';
import Cta from '../components/Cta';
import Sys from '../components/Sys';
import type { AigramContact, MethodSpec } from '../types';
import { formatStripTime } from '../utils/time';
import { useLocale } from '../i18n';

interface ReceiptProps {
  target: AigramContact;
  method: MethodSpec;
  ts: Date;
  onLobby: () => void;
}

const COUNTDOWN_SECONDS = 6;

export default function Receipt({ target, method, ts, onLobby }: ReceiptProps) {
  const { t } = useLocale();
  const { canEmit } = useGameEvent();
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          window.clearInterval(id);
          onLobby();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [onLobby]);

  const fileNum = (() => {
    let h = 0;
    const seed = target.telegram_id + ts.getTime();
    for (let i = 0; i < seed.length; i++) {
      h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return String(h % 999999).padStart(6, '0');
  })();

  return (
    <>
      <Strip status={t('strip.receipt')} right={`# ${fileNum}`} />

      <div className="wus-h2">
        {t('receipt.h2')}
        <small>{t('receipt.recorded', { time: formatStripTime(ts) })}</small>
      </div>

      <div className="wus-receipt">
        <div className="wus-receipt__row wus-receipt__row--head">
          <span>{t('receipt.subject')}</span>
          <span style={{ textAlign: 'right' }}>
            <b>{target.name.toUpperCase()}</b>
          </span>
        </div>
        <div className="wus-receipt__row">
          <span>{t('receipt.protocol')}</span>
          <span style={{ textAlign: 'right' }}>
            <b>{t(`method.${method.id}.short`)}</b>
          </span>
        </div>
        <div className="wus-receipt__row">
          <span>{t('receipt.shorthand')}</span>
          <span style={{ textAlign: 'right' }}>{method.num}</span>
        </div>
        <div className="wus-receipt__row">
          <span>{t('receipt.timestamp')}</span>
          <span style={{ textAlign: 'right' }}>{formatStripTime(ts)}</span>
        </div>
        <div className="wus-receipt__row">
          <span>OP · YOU</span>
          <span style={{ textAlign: 'right' }}>
            <b>{canEmit ? t('receipt.confirmed') : t('receipt.demo_status')}</b>
          </span>
        </div>

        <div
          className={`wus-stamp${!canEmit ? ' wus-stamp--demo' : ''}`}
          style={{ marginTop: 12 }}
        >
          {canEmit ? t('dial.stamp.sent') : t('dial.stamp.test')}
        </div>

        <div className="wus-receipt__countdown">
          {t('receipt.countdown', { n: String(remaining).padStart(2, '0') })}
        </div>
      </div>

      <Cta label={t('receipt.cta')} onTap={onLobby} silent />

      <Sys
        cells={[
          { k: '#', v: fileNum },
          { k: 'STATUS', v: canEmit ? 'SENT' : 'TEST' },
        ]}
      />
    </>
  );
}
