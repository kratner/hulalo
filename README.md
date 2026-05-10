# Hulalo — Responsive Motion Section Builder

Production-grade, responsive-first motion page section builder for agencies. Build fluid HTML5 web sections with elegant GSAP motion, preview in real-time, export as HTML/WebP/video.

## Quick Start

```bash
cd ~/hulalo
npm run dev
```

Opens editor at **localhost:5173** with live reload enabled.

## Workflow

1. **Edit**: Open `sections/[hero|features|testimonials|cta|split]/` files in VS Code
2. **See**: Changes live-reload in preview (no manual refresh)
3. **Inspect**: Adjust breakpoint (mobile/tablet/desktop), scrub timeline, view metadata
4. **Export**: (Phase 4) Download as HTML, WebP, or video

## Anatomy

All sections are self-contained HTML files:

```html
<!--
---
id: hero
type: hero
title: Hero Section
variants: [dark, light]
responsive: [mobile, tablet, desktop]
motion: scroll-triggered
export-formats: [html, webp, mp4]
---
-->
<section data-hulalo-id="hero" data-hulalo-type="hero" class="hulalo-section">
  <!-- Content + scoped CSS + GSAP timeline -->
</section>
```

See `sections/hero/hero.html` for a complete example.

## Editor UI

**Left panel**: Section library (select which section to edit)  
**Center**: Preview iframe with responsive breakpoints + timeline scrubber  
**Right panel**: Inspector (section metadata, export buttons)

## Key Technologies

- **Vite 5.4.6**: Build tool with HMR (hot module reload)
- **GSAP 3.15.0 + ScrollTrigger**: Animation library with scroll-driven motion
- **Vanilla JS**: Zero-framework editor UI (direct DOM, no overhead)
- **Responsive CSS**: `clamp()` sizing, `gsap.matchMedia()` for breakpoints

## Project Structure

```
sections/
├── _base/
│   ├── base.css      # Design tokens, responsive reset
│   └── motion.js     # createSectionTimeline() utility
├── hero/             # ✓ Complete
├── features/         # TODO Phase 2
├── testimonials/     # TODO Phase 2
├── cta/              # TODO Phase 2
└── split/            # TODO Phase 2

app/
├── main.js           # Editor bootstrap
├── editor.js         # Preview controller, timeline scrubber
└── styles/app.css    # Editor UI styling

export/              # TODO Phase 4
skills/              # TODO Phase 5
```

## Development

### Build for Production

```bash
npm run build
```

Outputs to `dist/` with optimized assets.

### Inspect Timeline in Browser

Open DevTools (F12) and run:

```javascript
// View current timeline state
window.__hulalo.hero.progress()

// Seek to 50%
window.__hulalo.hero.progress(0.5)

// Play/pause
window.__hulalo.hero.play()
window.__hulalo.hero.pause()
```

## Motion System

All sections use `createSectionTimeline(id)` from `sections/_base/motion.js`:

```javascript
import { createSectionTimeline } from '../../sections/_base/motion.js';

const tl = createSectionTimeline("hero");

// Add animations
tl.from(".hero-headline", { y: 40, opacity: 0, duration: 0.8 })
  .from(".hero-sub", { y: 30, opacity: 0, duration: 0.6 }, "-=0.4");

// Register for editor
window.__hulalo = window.__hulalo || {};
window.__hulalo["hero"] = tl;
```

Features:
- Responsive breakpoint handling (`mobile`, `tablet`, `desktop`)
- Accessibility: `prefers-reduced-motion` support (0s duration if enabled)
- ScrollTrigger auto-configured (start at 75% of viewport)
- Timeline starts paused for editor control

## Design Tokens

Available in `sections/_base/base.css`:

```css
/* Spacing (8pt grid) */
--space-xs: 0.5rem;    /* 8px */
--space-sm: 1rem;      /* 16px */
--space-md: 1.5rem;    /* 24px */
--space-lg: 2rem;      /* 32px */
--space-xl: 3rem;      /* 48px */
--space-2xl: 4rem;     /* 64px */
--space-3xl: 5rem;     /* 80px */
--space-4xl: 6rem;     /* 96px */

/* Typography (1.25 ratio, responsive with clamp()) */
--type-xs through --type-5xl

/* Easing */
--ease-out, --ease-in, --ease-in-out, --ease-back
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Modern ES2020+ (no transpilation)

## Known Limitations

- Export system not yet implemented (Phase 4)
- Section variants (dark/light) CSS present but not wired in UI (Phase 3)

## Contributing

Phase 2: Build 4 remaining sections using `sections/hero/hero.html` as template.  
Phase 3: Polish editor UI (variant toggle, section list active state).  
Phase 4: Implement export system (HTML, WebP, video).  
Phase 5: Create `section-builder` Claude Code skill.

---

**Status**: Phase 1 Foundation complete. Dev server running. Live editing workflow proven.
