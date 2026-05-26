import { useGameStats } from '@shared/runtime';
import LEDClock from '../components/LEDClock';
import Strip from '../components/Strip';
import Ticker from '../components/Ticker';
import Cta from '../components/Cta';
import Sys from '../components/Sys';
import LEDPhoto from '../components/LEDPhoto';
import type { AigramContact } from '../types';
import { formatStripTime } from '../utils/time';
import { useLocale } from '../i18n';

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
  const { t } = useLocale();
  const { stats } = useGameStats('wakeup_sent');
  const dispatched = String(stats.day_click_count || 0).padStart(2, '0');
  const total = String(stats.total_click_count || 0).padStart(2, '0');
  const online = String(stats.day_user_count || 0).padStart(2, '0');
  const queue = String(Math.max(0, 12 - (stats.day_user_count || 0))).padStart(2, '0');

  const tickerItems = [
    t('ticker.queue', { n: queue }),
    t('ticker.wakeups_tonight', { n: total }),
    t('ticker.ops_online', { n: online }),
    t('ticker.standing_by'),
  ];

  const feedContacts = contacts.slice(0, 4);

  return (
    <>
      <Strip
        status={t('strip.live_room')}
        right={`SYS ${formatStripTime(now)}`}
        demo={isDemo}
      />
      <Ticker items={tickerItems} />
      <LEDClock now={now} />

      <div className="wus-title">
        {t('app.title')}
        <small>{t('app.subtitle')}</small>
      </div>

      <div className="wus-stats">
        <div className="wus-stats__cell">
          <div className="wus-stats__v">{dispatched}</div>
          <div className="wus-stats__k">{t('stats.dispatched')}</div>
        </div>
        <div className="wus-stats__cell">
          <div className="wus-stats__v">{total}</div>
          <div className="wus-stats__k">{t('stats.total')}</div>
        </div>
        <div className="wus-stats__cell wus-stats__cell--alt">
          <div className="wus-stats__v">{online}</div>
          <div className="wus-stats__k">{t('stats.online')}</div>
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
            {contacts.length > 4
              ? t('lobby.asleep_more', { n: contacts.length - 4 })
              : t('lobby.asleep_count', { n: contacts.length })}
          </span>
        </div>
      ) : (
        <div className="wus-feed">
          <span>{t('lobby.registry_empty')}</span>
        </div>
      )}

      <Cta label={t('lobby.cta')} onTap={onStart} />

      <Sys
        cells={[
          { k: 'UNIT-3A' },
          { k: 'SIG', v: 'OK' },
        ]}
        onGear={onSettings}
        gearLabel={t('sys.gear')}
      />
    </>
  );
}
