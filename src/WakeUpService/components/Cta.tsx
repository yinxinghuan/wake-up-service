import { ChevronRight } from '../utils/icons';
import { playClick } from '../utils/sounds';

interface CtaProps {
  label: string;
  onTap: () => void;
  disabled?: boolean;
  /** Suppress the built-in click sfx (caller plays its own) */
  silent?: boolean;
}

export default function Cta({ label, onTap, disabled, silent }: CtaProps) {
  return (
    <button
      className={`wus-cta${disabled ? ' wus-cta--disabled' : ''}`}
      onPointerDown={(e) => {
        e.preventDefault();
        if (disabled) return;
        if (!silent) playClick();
        onTap();
      }}
      disabled={disabled}
    >
      <ChevronRight size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
      {label}
    </button>
  );
}
