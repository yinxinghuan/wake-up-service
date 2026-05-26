import { useEffect, useState } from 'react';
import { useGameEvent } from '@shared/runtime';
import Strip from '../components/Strip';
import Cta from '../components/Cta';
import Sys from '../components/Sys';
import type { AigramContact, Method } from '../types';
import { formatStripTime } from '../utils/time';

interface ReceiptProps {
  target: AigramContact;
  method: Method;
  ts: Date;
  onLobby: () => void;
}

const COUNTDOWN_SECONDS = 6;

export default function Receipt({ target, method, ts, onLobby }: ReceiptProps) {
  const { canEmit } = useGameEvent();
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);

  // Auto-return countdown — bounded setInterval is fine here (post first-touch state)
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
      <Strip status="RECEIPT" right={`# ${fileNum}`} />

      <div className="wus-h2">
        DISPATCH  RECEIPT
        <small>RECORDED · {formatStripTime(ts)}</small>
      </div>

      <div className="wus-receipt">
        <div className="wus-receipt__row wus-receipt__row--head">
          <span>SUBJECT</span>
          <span style={{ textAlign: 'right' }}>
            <b>{target.name.toUpperCase()}</b>
          </span>
        </div>
        <div className="wus-receipt__row">
          <span>PROTOCOL</span>
          <span style={{ textAlign: 'right' }}>
            <b>{method.shortName}</b>
          </span>
        </div>
        <div className="wus-receipt__row">
          <span>SHORTHAND</span>
          <span style={{ textAlign: 'right' }}>{method.num}</span>
        </div>
        <div className="wus-receipt__row">
          <span>TIMESTAMP</span>
          <span style={{ textAlign: 'right' }}>{formatStripTime(ts)}</span>
        </div>
        <div className="wus-receipt__row">
          <span>OP · YOU</span>
          <span style={{ textAlign: 'right' }}>
            <b>{canEmit ? 'CONFIRMED' : 'DEMO'}</b>
          </span>
        </div>

        <div
          className={`wus-stamp${!canEmit ? ' wus-stamp--demo' : ''}`}
          style={{ marginTop: 12 }}
        >
          {canEmit ? 'SIGNAL DISPATCHED' : 'LOCAL TEST ONLY'}
        </div>

        <div className="wus-receipt__countdown">
          RETURN TO LOBBY · {String(remaining).padStart(2, '0')}
        </div>
      </div>

      <Cta label="LOBBY  NOW" onTap={onLobby} silent />

      <Sys
        cells={[
          { k: '#', v: fileNum },
          { k: 'STATUS', v: canEmit ? 'SENT' : 'TEST' },
        ]}
      />
    </>
  );
}
