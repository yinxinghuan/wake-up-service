import Strip from '../components/Strip';
import Cta from '../components/Cta';
import Sys from '../components/Sys';
import { useTheme } from '../theme';
import { THEME_COLORS, THEME_FONTS, type ThemeColor, type ThemeFont } from '../types';
import { playClick, playShift } from '../utils/sounds';
import { useLocale, LOCALES, type Locale } from '../i18n';

const COLOR_PREVIEW: Record<ThemeColor, string> = {
  crimson:  '#ff2a1c',
  amber:    '#ffae3a',
  phosphor: '#5cff7c',
  cyan:     '#5cf5ff',
  synth:    '#ff5cf5',
};

const COLOR_NAME: Record<ThemeColor, string> = {
  crimson:  'CRIMSON',
  amber:    'AMBER',
  phosphor: 'PHOSPHOR',
  cyan:     'CYAN',
  synth:    'SYNTH',
};

const FONT_FAMILY: Record<ThemeFont, string> = {
  crt:   "'VT323',monospace",
  pixel: "'Press Start 2P',monospace",
  dot:   "'DotGothic16',monospace",
  mono:  "'Major Mono Display',monospace",
};

const FONT_GLYPH: Record<ThemeFont, string> = {
  crt: 'Aa', pixel: 'A', dot: 'A', mono: 'a',
};

const FONT_SAMPLE_FILE: Record<ThemeFont, string> = {
  crt: 'VT323',
  pixel: 'PRESS START 2P',
  dot: 'DOTGOTHIC16',
  mono: 'MAJOR MONO + JBM',
};

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const { color, font, brightness, setColor, setFont, setBrightness, reset } = useTheme();
  const { t, locale, setLocale } = useLocale();

  return (
    <>
      <Strip status={t('strip.display_settings')} right="v1.0" onBack={onClose} />

      <div className="wus-h2">
        {t('settings.h2')}
        <small>{t('settings.subtitle')}</small>
      </div>

      <div className="wus-menu">
        <div className="wus-settings__section">
          <div className="wus-section-h">{t('settings.color')}</div>
          {THEME_COLORS.map((c) => {
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
                <div className="wus-opt__color" style={{ color: COLOR_PREVIEW[c] }} />
                <div>
                  <div className="wus-opt__h">{COLOR_NAME[c]}</div>
                  <div className="wus-opt__s">{t(`color.${c}.sub`)}</div>
                </div>
                <div className="wus-opt__bullet" />
              </button>
            );
          })}
        </div>

        <div className="wus-settings__section">
          <div className="wus-section-h">{t('settings.typeface')}</div>
          {THEME_FONTS.map((f) => {
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
                  style={{ fontFamily: FONT_FAMILY[f], fontSize }}
                >
                  {FONT_GLYPH[f]}
                </div>
                <div>
                  <div className="wus-opt__h" style={{ fontFamily: FONT_FAMILY[f] }}>
                    {t(`font.${f}.name`)}
                  </div>
                  <div className="wus-opt__s">{FONT_SAMPLE_FILE[f]}</div>
                </div>
                <div className="wus-opt__bullet" />
              </button>
            );
          })}
        </div>

        <div className="wus-settings__section">
          <div className="wus-section-h">{t('settings.language')}</div>
          {LOCALES.map((l: Locale) => {
            const sel = l === locale;
            return (
              <button
                key={l}
                className={`wus-opt${sel ? ' wus-opt--sel' : ''}`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  if (!sel) playShift();
                  setLocale(l);
                }}
              >
                <div
                  className="wus-opt__font"
                  style={{ fontFamily: FONT_FAMILY[font], fontSize: 11 }}
                >
                  {l.toUpperCase()}
                </div>
                <div>
                  <div className="wus-opt__h">{t(`locale.${l}`)}</div>
                  <div className="wus-opt__s">{l.toUpperCase()}</div>
                </div>
                <div className="wus-opt__bullet" />
              </button>
            );
          })}
        </div>

        <div className="wus-settings__section">
          <div className="wus-section-h">{t('settings.brightness')}</div>
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
            {t('settings.reset')}
          </button>
        </div>
      </div>

      <Cta label={t('settings.cta')} onTap={onClose} />

      <Sys
        cells={[
          { k: 'PREVIEW · LIVE' },
          { k: 'UNIT', v: '3A' },
        ]}
      />
    </>
  );
}
