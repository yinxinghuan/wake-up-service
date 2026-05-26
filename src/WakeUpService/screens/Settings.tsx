import Strip from '../components/Strip';
import Cta from '../components/Cta';
import Sys from '../components/Sys';
import { useTheme } from '../theme';
import { THEME_COLORS, THEME_FONTS, type ThemeColor, type ThemeFont } from '../types';
import { playClick, playShift } from '../utils/sounds';

const COLOR_META: Record<ThemeColor, { name: string; sub: string; preview: string }> = {
  crimson:  { name: 'CRIMSON',  sub: 'ALARM · DEFAULT',       preview: '#ff2a1c' },
  amber:    { name: 'AMBER',    sub: '70s VINTAGE CLOCK',     preview: '#ffae3a' },
  phosphor: { name: 'PHOSPHOR', sub: 'CRT TERMINAL GREEN',    preview: '#5cff7c' },
  cyan:     { name: 'CYAN',     sub: 'ICE STATION',           preview: '#5cf5ff' },
  synth:    { name: 'SYNTH',    sub: 'AFTERHOURS PINK',       preview: '#ff5cf5' },
};

const FONT_META: Record<ThemeFont, { name: string; sub: string; glyph: string; fontFamily: string }> = {
  crt:   { name: 'CRT  DISPLAY', sub: 'VT323',               glyph: 'Aa', fontFamily: "'VT323',monospace" },
  pixel: { name: 'PIXEL  BLOCK', sub: 'PRESS START 2P',      glyph: 'A',  fontFamily: "'Press Start 2P',monospace" },
  dot:   { name: 'DOT  MATRIX',  sub: 'DOTGOTHIC16',         glyph: 'A',  fontFamily: "'DotGothic16',monospace" },
  mono:  { name: 'MONO  ENG',    sub: 'MAJOR MONO + JBM',    glyph: 'a',  fontFamily: "'Major Mono Display',monospace" },
};

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const { color, font, brightness, setColor, setFont, setBrightness, reset } = useTheme();

  return (
    <>
      <Strip status="DISPLAY SETTINGS" right="v1.0" onBack={onClose} />

      <div className="wus-h2">
        DISPLAY
        <small>CHOOSE YOUR LCD</small>
      </div>

      <div className="wus-menu">
        <div className="wus-settings__section">
          <div className="wus-section-h">COLOR · TINT</div>
          {THEME_COLORS.map((c) => {
            const meta = COLOR_META[c];
            const sel = c === color;
            return (
              <button
                key={c}
                className={`wus-opt${sel ? ' wus-opt--sel' : ''}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  if (!sel) playShift();
                  setColor(c);
                }}
              >
                <div className="wus-opt__color" style={{ color: meta.preview }} />
                <div>
                  <div className="wus-opt__h">{meta.name}</div>
                  <div className="wus-opt__s">{meta.sub}</div>
                </div>
                <div className="wus-opt__bullet" />
              </button>
            );
          })}
        </div>

        <div className="wus-settings__section">
          <div className="wus-section-h">TYPEFACE</div>
          {THEME_FONTS.map((f) => {
            const meta = FONT_META[f];
            const sel = f === font;
            const fontSize = f === 'pixel' ? 9 : 14;
            return (
              <button
                key={f}
                className={`wus-opt${sel ? ' wus-opt--sel' : ''}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  if (!sel) playShift();
                  setFont(f);
                }}
              >
                <div
                  className="wus-opt__font"
                  style={{ fontFamily: meta.fontFamily, fontSize }}
                >
                  {meta.glyph}
                </div>
                <div>
                  <div className="wus-opt__h" style={{ fontFamily: meta.fontFamily }}>
                    {meta.name}
                  </div>
                  <div className="wus-opt__s">{meta.sub}</div>
                </div>
                <div className="wus-opt__bullet" />
              </button>
            );
          })}
        </div>

        <div className="wus-settings__section">
          <div className="wus-section-h">BRIGHTNESS</div>
          <div className="wus-bright">
            <div className="wus-bright__meter">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={i < brightness ? 'on' : ''}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    playClick();
                    setBrightness(i + 1);
                  }}
                />
              ))}
            </div>
            <div className="wus-bright__label">{String(brightness).padStart(2, '0')} / 06</div>
          </div>
        </div>

        <div className="wus-settings__section">
          <button
            className="wus-reset"
            onPointerDown={(e) => {
              e.preventDefault();
              playClick();
              reset();
            }}
          >
            RESET  TO  DEFAULTS
          </button>
        </div>
      </div>

      <Cta label="APPLY · DONE" onTap={onClose} />

      <Sys
        cells={[
          { k: 'PREVIEW · LIVE' },
          { k: 'UNIT', v: '3A' },
        ]}
      />
    </>
  );
}
