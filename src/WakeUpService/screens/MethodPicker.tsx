import Strip from '../components/Strip';
import Cta from '../components/Cta';
import Sys from '../components/Sys';
import { METHODS } from '../utils/methods';
import { methodIcon } from '../utils/icons';
import type { MethodId, AigramContact } from '../types';
import { playSelect } from '../utils/sounds';
import { formatStripTime } from '../utils/time';
import { useLocale } from '../i18n';

interface MethodPickerProps {
  target: AigramContact;
  now: Date;
  selectedMethod: MethodId | null;
  onSelect: (id: MethodId) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export default function MethodPicker({
  target,
  now,
  selectedMethod,
  onSelect,
  onConfirm,
  onBack,
}: MethodPickerProps) {
  const { t } = useLocale();
  const selectedSpec = METHODS.find((m) => m.id === selectedMethod);

  return (
    <>
      <Strip
        status={t('strip.protocol_catalog')}
        right="06 OPTS"
        onBack={onBack}
      />

      <div className="wus-h2">
        {t('method.h2')}
        <small>
          {t('method.subtitle', {
            name: target.name.toUpperCase(),
            time: formatStripTime(now),
          })}
        </small>
      </div>

      <div className="wus-menu">
        {METHODS.map((m) => {
          const sel = m.id === selectedMethod;
          const Icon = methodIcon(m.icon);
          return (
            <button
              key={m.id}
              className={`wus-method${sel ? ' wus-method--sel' : ''}`}
              // onClick — methods list scrolls; pointerdown would select
              // mid-scroll. See scroll-vs-click skill.
              onClick={(e) => {
                e.preventDefault();
                playSelect();
                onSelect(m.id);
              }}
            >
              <div className="wus-method__num">{m.num}</div>
              <div className="wus-method__icon">
                <Icon size={18} />
              </div>
              <div className="wus-method__body">
                <div className="wus-method__name">{t(`method.${m.id}.name`)}</div>
                <div className="wus-method__desc">{t(`method.${m.id}.desc`)}</div>
              </div>
            </button>
          );
        })}
      </div>

      <Cta
        label={t('method.cta')}
        onTap={onConfirm}
        disabled={!selectedMethod}
      />

      <Sys
        cells={[
          { k: 'PROTOCOL', v: selectedSpec ? selectedSpec.num : '—' },
          { k: 'FEE · $00.00' },
        ]}
      />
    </>
  );
}
