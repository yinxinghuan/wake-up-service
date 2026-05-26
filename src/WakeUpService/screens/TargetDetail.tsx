import LEDPhoto from '../components/LEDPhoto';
import Strip from '../components/Strip';
import Cta from '../components/Cta';
import Sys from '../components/Sys';
import type { AigramContact } from '../types';
import { useLocale } from '../i18n';

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
  const { t } = useLocale();
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
        status={t('strip.target_locked')}
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
        <div className="wus-target__meta">{t('detail.meta', { id: fileNum })}</div>
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
          <div className="wus-infotable__v">{t('detail.last_ping_value')}</div>
        </div>
        <div className="wus-infotable__ic">
          <div className="wus-infotable__k">TONIGHT</div>
          <div className="wus-infotable__v">{t('detail.tonight_value')}</div>
        </div>
      </div>

      <div className="wus-dossier">
        {t('detail.dossier_l1')}<br />
        {t('detail.dossier_l2')}<br />
        {t('detail.dossier_l3')}
      </div>

      <Cta label={t('detail.cta')} onTap={onNext} />

      <Sys
        cells={[
          { k: 'SUBJ', v: contact.name.toUpperCase() },
          { k: 'RISK', v: 'LOW' },
        ]}
      />
    </>
  );
}
