import { useGameStats } from '@shared/runtime';
import LEDClock from '../components/LEDClock';
import Strip from '../components/Strip';
import Ticker from '../components/Ticker';
import Cta from '../components/Cta';
import Sys from '../components/Sys';
import LEDPhoto from '../components/LEDPhoto';
import type { AigramContact } from '../types';
import { formatStripTime } from '../utils/time';

interface LobbyProps {
  now: Date;
  contacts: AigramContact[];
  isDemo: boolean;
  onStart: () => void;
  onSettings: () => void;
}

export default function Lobby({
  now,
  contacts,
  isDemo,
  onStart,
  onSettings,
}: LobbyProps) {
  const { stats } = useGameStats('wakeup_sent');
  const dispatched = String(stats.day_click_count || 0).padStart(2, '0');
  const total = String(stats.total_click_count || 0).padStart(2, '0');
  const online = String(stats.day_user_count || 0).padStart(2, '0');
  const queue = String(Math.max(0, 12 - (stats.day_user_count || 0))).padStart(2, '0');

  const tickerItems = [
    `QUEUE ${queue}`,
    `WAKE-UPS TONIGHT · ${total}`,
    `OPS ONLINE · ${online}`,
    'OPERATORS STANDING BY · 24/7',
  ];

  const feedContacts = contacts.slice(0, 4);

  return (
    <>
      <Strip
        status="LIVE · ROOM 3A"
        right={`SYS ${formatStripTime(now)}`}
        demo={isDemo}
      />
      <Ticker items={tickerItems} />
      <LEDClock now={now} />

      <div className="wus-title">
        WAKE-UP
        <small>DISPATCH SERVICE</small>
      </div>

      <div className="wus-stats">
        <div className="wus-stats__cell">
          <div className="wus-stats__v">{dispatched}</div>
          <div className="wus-stats__k">DISPATCHED</div>
        </div>
        <div className="wus-stats__cell">
          <div className="wus-stats__v">{total}</div>
          <div className="wus-stats__k">TOTAL</div>
        </div>
        <div className="wus-stats__cell wus-stats__cell--alt">
          <div className="wus-stats__v">{online}</div>
          <div className="wus-stats__k">ONLINE</div>
        </div>
      </div>

      {feedContacts.length > 0 ? (
        <div className="wus-feed">
          <div className="wus-feed__stack">
            {feedContacts.map((c) => (
              <LEDPhoto
                key={c.telegram_id}
                src={c.head_url}
                fallback={c.name}
                size="mini"
                alt={c.name}
              />
            ))}
          </div>
          <span style={{ marginLeft: 'auto' }}>
            {contacts.length > 4 ? `+${contacts.length - 4} ASLEEP` : `${contacts.length} ASLEEP`}
          </span>
        </div>
      ) : (
        <div className="wus-feed">
          <span>· REGISTRY EMPTY ·</span>
        </div>
      )}

      <Cta label="PLACE  WAKE-UP  CALL" onTap={onStart} />

      <Sys
        cells={[
          { k: 'UNIT-3A' },
          { k: 'SIG', v: 'OK' },
        ]}
        onGear={onSettings}
      />
    </>
  );
}
