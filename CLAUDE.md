# Wake-Up Service — Dev Guidelines

> 复制自 `/Users/yin/code/games/CLAUDE.md`，per-game 微调。

## Concept

7-screen service-flow game: place a "wake-up call" to a friend, choose a protocol (marching band, 100 cats, ice bucket, drill sergeant, robocall storm, rooster choir), the platform pushes them a notification + AI-generated image of the chaos. Visual: LCD alarm clock console. 5 color × 4 font themes switchable in-game.

## Screens

`lobby → picker → detail → method → dialing → receipt → (settings)`

## Tech

- React 18 + TS strict + Less + Vite 5
- Aigram runtime via `@shared` (bridge / useGameEvent / useGameStats / useGenImage)
- LED filter on real avatars: CSS only (`mix-blend-mode: color` + dot grille + scanlines), zero canvas

## Hard rules (memory)

- `onPointerDown` only
- **Audio first-touch only** — never `resumeAudio()` on mount, only inside first onPointerDown branch
- **No `setInterval` for the lobby clock** — use rAF 1Hz tick (preload safety)
- **No emoji in UI** — every glyph is SVG (`utils/icons.tsx`)
- **No outer `border-radius`** on root — Aigram already wraps with rounded frame
- **AlterU watermark** (not Aigram) — `/img/alteru.svg`, no `filter: invert`
- BEM `wus-` prefix on CSS classes + `@keyframes wus-*`

## Themes

```
COLOR: crimson | amber | phosphor | cyan | synth     → data-theme=<id>
FONT:  crt | pixel | dot | mono                       → data-font=<id>
```

CSS variables on `<div className="wus-root">` wrapper. Theme + font + brightness persisted to localStorage (`wakeup_theme`, `wakeup_font`, `wakeup_brightness`).

## Build

`npm install && npm run build` — must pass before commit.
