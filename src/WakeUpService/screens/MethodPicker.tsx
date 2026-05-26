import Strip from '../components/Strip';
import Cta from '../components/Cta';
import Sys from '../components/Sys';
import { METHODS } from '../utils/methods';
import { methodIcon } from '../utils/icons';
import type { MethodId, AigramContact } from '../types';
import { playSelect } from '../utils/sounds';
import { formatStripTime } from '../utils/time';

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
  return (
    <>
      <Strip
        status="PROTOCOL CATALOG"
        right="06 OPTS"
        onBack={onBack}
      />

      <div className="wus-h2">
        CHOOSE  PROTOCOL
        <small>FOR · {target.name.toUpperCase()} · {formatStripTime(now)}</small>
      </div>

      <div className="wus-menu">
        {METHODS.map((m) => {
          const sel = m.id === selectedMethod;
          const Icon = methodIcon(m.icon);
          return (
            <button
              key={m.id}
              className={`wus-method${sel ? ' wus-method--sel' : ''}`}
              onPointerDown={(e) => {
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
                <div className="wus-method__name">{m.name}</div>
                <div className="wus-method__desc">{m.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      <Cta
        label="DISPATCH  NOW"
        onTap={onConfirm}
        disabled={!selectedMethod}
      />

      <Sys
        cells={[
          { k: 'PROTOCOL', v: selectedMethod ? METHODS.find((x) => x.id === selectedMethod)!.num : '—' },
          { k: 'FEE · $00.00' },
        ]}
      />
    </>
  );
}
