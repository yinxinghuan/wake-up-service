import type { CSSProperties } from 'react';

interface LEDPhotoProps {
  src?: string;
  /** 2-char initials to render when src is empty/broken */
  fallback?: string;
  /** Controls grille density */
  size?: 'mini' | 'sm' | 'md' | 'lg';
  /** Add 4 corner brackets */
  framed?: boolean;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}

/**
 * Real avatar with a CSS LED filter (mix-blend-mode: color tint + dot
 * grille + scanlines). No canvas. Theme color is inherited from the
 * surrounding CSS variables.
 */
export default function LEDPhoto({
  src,
  fallback = '?',
  size = 'md',
  framed = false,
  className = '',
  style,
  alt = '',
}: LEDPhotoProps) {
  const cls = `wus-led-photo wus-led-photo--${size} ${className}`.trim();
  const initials = (fallback || '?').slice(0, 2).toUpperCase();

  return (
    <div className={cls} style={style}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="wus-led-photo__img"
          draggable={false}
          loading="lazy"
          onError={(e) => {
            // Swap to initials placeholder if the image fails to load
            const img = e.currentTarget;
            img.style.display = 'none';
            const ph = img.parentElement?.querySelector(
              '.wus-led-photo__placeholder',
            ) as HTMLElement | null;
            if (ph) ph.style.display = 'grid';
          }}
        />
      ) : null}
      <div
        className="wus-led-photo__placeholder"
        style={{ display: src ? 'none' : 'grid' }}
      >
        {initials}
      </div>
      <div className="wus-led-photo__tint" />
      {framed && (
        <>
          <span className="wus-led-photo__corner wus-led-photo__corner--tl" />
          <span className="wus-led-photo__corner wus-led-photo__corner--tr" />
          <span className="wus-led-photo__corner wus-led-photo__corner--bl" />
          <span className="wus-led-photo__corner wus-led-photo__corner--br" />
        </>
      )}
    </div>
  );
}
