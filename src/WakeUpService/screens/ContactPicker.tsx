import LEDPhoto from '../components/LEDPhoto';
import Strip from '../components/Strip';
import Cta from '../components/Cta';
import Sys from '../components/Sys';
import type { AigramContact } from '../types';
import { playSelect } from '../utils/sounds';

interface ContactPickerProps {
  contacts: AigramContact[];
  loading: boolean;
  isDemo: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const FAKE_PINGS = ['0:14', '0:02', '1:48', '3:11', '0:34', '2:02'];
const FAKE_STAGES = ['DEEP', 'REM', 'DEEP', 'OUT', 'LIGHT', 'DEEP'];

export default function ContactPicker({
  contacts,
  loading,
  isDemo,
  selectedId,
  onSelect,
  onNext,
  onBack,
}: ContactPickerProps) {
  const selected = contacts.find((c) => c.telegram_id === selectedId);

  return (
    <>
      <Strip
        status="SLEEPER REGISTRY"
        right={contacts.length > 0 ? `${contacts.length} ENTR${contacts.length === 1 ? 'Y' : 'IES'}` : '—'}
        onBack={onBack}
        demo={isDemo}
      />

      <div className="wus-h2">
        SELECT  SLEEPER
        <small>TAP TO TARGET</small>
      </div>

      {loading ? (
        <div className="wus-loading">FETCHING REGISTRY</div>
      ) : contacts.length === 0 ? (
        <div className="wus-loading" style={{ flexDirection: 'column', gap: 8, textAlign: 'center', padding: 24 }}>
          NO SLEEPERS REGISTERED
          <span style={{ fontSize: 9, letterSpacing: '0.25em', opacity: 0.7 }}>
            ADD A FRIEND IN AIGRAM TO USE THIS SERVICE
          </span>
        </div>
      ) : (
        <div className="wus-menu">
          {contacts.map((c, i) => {
            const sel = c.telegram_id === selectedId;
            const stage = FAKE_STAGES[i % FAKE_STAGES.length];
            return (
              <button
                key={c.telegram_id}
                className={`wus-contact${sel ? ' wus-contact--sel' : ''}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  playSelect();
                  onSelect(c.telegram_id);
                }}
              >
                <LEDPhoto
                  src={c.head_url}
                  fallback={c.name}
                  framed
                  size="md"
                  className="wus-contact__photo"
                  alt={c.name}
                />
                <div className="wus-contact__info">
                  <div className="wus-contact__h">{c.name.toUpperCase()}</div>
                  <div className="wus-contact__s">
                    LAST PING · {FAKE_PINGS[i % FAKE_PINGS.length]} AGO
                  </div>
                </div>
                <div className={`wus-contact__last${stage === 'REM' ? ' wus-contact__last--hot' : ''}`}>
                  {stage}
                </div>
                <div className="wus-contact__bullet" />
              </button>
            );
          })}
        </div>
      )}

      <Cta
        label="NEXT · TARGET"
        onTap={onNext}
        disabled={!selected}
      />

      <Sys
        cells={[
          { k: 'TARGET', v: selected ? selected.name.toUpperCase() : '—' },
          { k: 'EST', v: 'NOW' },
        ]}
      />
    </>
  );
}
