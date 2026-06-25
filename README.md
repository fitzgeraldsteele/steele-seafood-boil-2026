# 🦀🇺🇸 4th of July Seafood Boil — Steele House

A gloriously over-the-top, bilingual (English/Spanish) party site for the Steele family
4th of July Seafood Boil.

**📅 July 4, 2026 · 🕒 3:00 PM · 🏠 14307 266th Pl NE, Duvall, WA**

## 🌐 Live Site
https://fitzgeraldsteele.github.io/steele-seafood-boil-2026/

## What's Inside
- **Hero** — screaming eagle, patriotic crab mascot, jet flyover intro animation
- **Menu / El Menú** — the full seafood boil spread, bilingual
- **Who Brings What** — Steeles 🦀 / Salcedos 🦐 / Martinez 🌭
- **Schedule / Horario** — timeline with a fireworks burst on "THE DUMP"
- **Playlist / La Música** — classic 4th + Colombian/Latin + party vibes
- **Footer** — ¡Feliz 4 de Julio!

## Tech
- Vanilla HTML/CSS/JS — no build step, no dependencies
- Canvas confetti engine (lightweight)
- IntersectionObserver scroll triggers
- Google Fonts: Anton, Bebas Neue, Inter
- Mobile-first, `prefers-reduced-motion` respected
- All audio user-initiated (tap to enter); missing audio fails silently

## Files
```
index.html      — markup, all 6 sections
styles.css      — maximalist patriotic design system
script.js       — intro sequence, confetti, scroll fireworks, audio
assets/         — generated graphics + (optional) sound effects
```

## Assets
Graphics generated with an image model, backgrounds knocked out to transparent PNG
via `assets/knockout.py`. Sound effects (optional): `eagle-screech.mp3`,
`jet-flyover.mp3`, `firework-pop.mp3`.

---
_Built with love (and an aggressive amount of fireworks) for the Steele household._
