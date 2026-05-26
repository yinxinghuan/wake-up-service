import LEDPhoto from '../components/LEDPhoto';
import Strip from '../components/Strip';
import Cta from '../components/Cta';
import Sys from '../components/Sys';
import type { AigramContact } from '../types';

interface TargetDetailProps {
  contact: AigramContact;
  onNext: () => void;
  onBack: () => void;
}

export default function TargetDetail({
  contact,
  onNext,
  onBack,
}: TargetDetailProps) {
  // Derive deterministic "file number" from telegram_id so it feels stable.
  const fileNum = (() => {
    let h = 0;
    for (let i = 0; i < contact.telegram_id.length; i++) {
      h = (h * 31 + contact.telegram_id.charCodeAt(i)) >>> 0;
    }
    return String(h % 9999).padStart(4, '0');
  })();

  return (
    <>
      <Strip
        status="TARGET LOCKED"
        right={`FILE · ${fileNum}`}
        onBack={onBack}
      />

      <div className="wus-target">
        <div className="wus-target__portrait">
          <LEDPhoto
            src={contact.head_url}
            fallback={contact.name}
            size="lg"
            framed
            alt={contact.name}
          />
          <span className="wus-target__scan" />
        </div>
        <div className="wus-target__name">{contact.name.toUpperCase()}</div>
        <div className="wus-target__meta">SLEEPER · ROOM 3A · ID {fileNum}</div>
      </div>

      <div className="wus-infotable">
        <div className="wus-infotable__ic">
          <div className="wus-infotable__k">STAGE</div>
          <div className="wus-infotable__v">REM 0:12</div>
        </div>
        <div className="wus-infotable__ic wus-infotable__ic--warn">
          <div className="wus-infotable__k">VULN</div>
          <div className="wus-infotable__v">HIGH</div>
        </div>
        <div className="wus-infotable__ic">
          <div className="wus-infotable__k">LAST PING</div>
          <div className="wus-infotable__v">0:02 AGO</div>
        </div>
        <div className="wus-infotable__ic">
          <div className="wus-infotable__k">TONIGHT</div>
          <div className="wus-infotable__v">×4 CALLS</div>
        </div>
      </div>

      <div className="wus-dossier">
        DOSSIER · DOES NOT HEAR ALARMS<br />
        HAS 3 PILLOWS · FAN ON HIGH<br />
        WAKES TO CATS · CAFFEINE TOL · 4
      </div>

      <Cta label="SET  PROTOCOL" onTap={onNext} />

      <Sys
        cells={[
          { k: 'SUBJ', v: contact.name.toUpperCase() },
          { k: 'RISK', v: 'LOW' },
        ]}
      />
    </>
  );
}
