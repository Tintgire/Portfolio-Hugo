# Portfolio Cinematic Redesign — Design Spec

**Date:** 2026-05-13
**Author:** Hugo Boidin
**Status:** Approved, ready for implementation plan

---

## 1. Context & goal

The current portfolio (https://portfolio-hugo-ten.vercel.app, repo `Tintgire/Portfolio-Hugo`) is a competent React + Three.js site with 8 sections. The goal is to transform it into a **"Games Awards / Awwwards"-grade cinematic experience** while staying in the existing dark / purple / 3D visual identity (referred to as "Cosmic Cinematic" — direction A from vibe selection).

**Target audiences (validated)**
- Recruiters at premium creative agencies (Active Theory, Locomotive, Resn, etc.)
- Freelance clients (founders, CTOs)
- Investors / startup network (positioning Hugo as an AI Product Engineer / founder)

**Explicitly excluded:** "delirious tech showcase for dev community" — the site must remain professional and conversion-friendly for clients and investors, not purely experimental.

---

## 2. Design principles

1. **One continuous cinematic experience**, not a stack of independent sections.
2. **Dark / violet / 3D stays** — evolution of the current identity, not a reskin.
3. **Spectacular over safe** when the user has to choose (e.g., spectacular "dissolve" transitions over fade-outs).
4. **Performance and accessibility are non-negotiable**: 60fps target on desktop, lighter scene on mobile (still 3D), `prefers-reduced-motion` respected.
5. **Extensibility**: data structures (Works in particular) must accommodate new entries with zero refactor.

---

## 3. Macro architecture — 8 sections → 5 acts

The current 8 sections are consolidated into 5 narrative acts. A single global Three.js canvas (mounted at the `App` level, `position: fixed` behind DOM content) renders the scene; the scene state is driven by scroll progress.

| Act | Title | Replaces | DOM content | 3D scene state |
|-----|-------|----------|-------------|----------------|
| **I** | Intro | Hero | Typing animation, scroll cue | Floating PC ("vaisseau"), particles, camera close, idle rotation |
| **II** | Identité | About + Experience timeline | Bio block, vertical timeline with parallax | PC dissolves into particles → 3 trait orbs emerge; camera pulls back + pans right |
| **III** | Craft | Tech logos | Tagline + interactive logo descriptions | Orbs fuse into central violet core; tech logos orbit on 2 rings; camera zooms in |
| **IV** | Proof (clou du show) | Works + new Rubi featured project | Rubi info block (large), then carousel of other projects | Camera flies through core into "project nebula"; Rubi 4-phones parallax; pan latéral to other projects |
| **V** | Trust + Contact | Feedbacks + DownloadSection (diplôme) + Contact | Testimonial cards, diploma badge stat, contact form | Camera pulls back massively; Earth emerges from below; cards float in parallax |

**Removed as standalone:** `DownloadSection` becomes a badge integrated in Act V.

**Mobile** (< 768px): the same 5-act structure but with a simplified scene. See §7 for fallbacks.

---

## 4. Pillar 1 — Scénographie cinématique

The most ambitious pillar. Driven by scroll, a single canvas evolves through 5 keyframe states.

### 4.1 Tech stack

| Tool | Role |
|------|------|
| **Lenis** | Smooth scroll (inertia, buttery feel). Mounted globally in `App.jsx`. |
| **@react-three/fiber + @react-three/drei** | Single global `<Canvas>`. Drei's `<ScrollControls>` drives a unified scroll timeline. |
| **Framer Motion** (`useScroll`, `useTransform`, `useSpring`) | DOM-layer scroll-driven animations (text reveals, parallax, opacity). |
| **GSAP ScrollTrigger** | Backup, only if precise pinning is needed (likely not required). |

### 4.2 Scene composition

Single scene with persistent objects whose visibility / position / scale are driven by scroll progress (`0 → 1`):

```
<Scene>
  <Stars density={driven by scroll, peaks at Act I and V} />
  <Particles instance={count=5000, color and motion morph between acts} />
  <PC model={GLTF, visible Act I, dissolves Act II}/>
  <TraitOrbs visible={Act II} />
  <TechCore visible={Act III} />
  <TechLogos orbital ring={visible Act III} />
  <ProjectsNebula visible={Act IV} children={worksData.map(p => <Project3D />)} />
  <Earth visible={Act V} />
  <Camera position={interpolated between 5 keyframes} />
</Scene>
```

### 4.3 Camera keyframes

| Act | Camera position (approx) | Camera lookAt |
|-----|--------------------------|---------------|
| I   | `[0, 0, 5]` | PC center |
| II  | `[3, 1, 8]` | Mid-point between dissolving PC and orbs |
| III | `[0, 0, 4]` | Tech core |
| IV  | `[0, 0, -2]` | Rubi phones (panning right for other projects) |
| V   | `[0, 8, 15]` | Earth |

Interpolation: cubic easing via Drei's `<PerspectiveCamera makeDefault />` + manual `useFrame` driving from scroll progress, or `@react-spring/three` for declarative tweens.

### 4.4 Spectacular dissolve (Act I → II)

The PC model breaks into ~5000 particle points that flow upward and reorganize into 3 trait orbs. Implementation: GPU-based particle system with morph between source position (PC mesh sampling) and target positions (orb centers + jitter). Driven by a single uniform `t = 0..1` mapped to scroll progress.

### 4.5 Mobile scene (allégé but still 3D)

Per user request — keep some 3D animation on mobile, not full fallback to static.

- Single `<Canvas>` runs, but with:
  - Particle count divided by 4 (~1200 instead of 5000)
  - PC model swapped for a lower-poly primitive (rounded box + emissive material) — file size critical
  - Camera animations simplified (2-3 keyframes instead of 5)
  - No GPU-heavy effects (no bloom, no post-processing)
- DPR (devicePixelRatio) clamped to 1.5 max
- `<Suspense>` with text fallback during model load

---

## 5. Pillar 2 — Tactile / micro-interactions

### 5.1 Cursor

**Decision: keep the native cursor**, no custom cursor element. Magnetism on interactive elements happens through element transforms only.

### 5.2 Magnetism

Applied to: nav links, hero CTAs, project cards, social icons, form submit, sound toggle.

- On `mouseenter`: element's transform tracks the cursor with a spring (`stiffness: 150, damping: 15`), max offset ~6-10px depending on element size
- On `mouseleave`: spring returns to origin

Reusable hook: `useMagneticHover(ref, { strength: 0.4, max: 10 })`.

### 5.3 Sound design

**Toggle in the nav, OFF by default** (respects browser autoplay policy + user preference + accessibility).

| Trigger | Sound | Duration | Volume |
|---------|-------|----------|--------|
| Ambient (constant when enabled) | Deep cosmic pad loop | Looped | -24 dB |
| Hover on interactive element | Soft "whoosh" | ~150ms | -18 dB |
| Click on CTA | Crystalline tick | ~80ms | -14 dB |
| Act transition (scroll crosses act boundary) | Marked "sweep" | ~400ms | -16 dB |
| Form submit success | Ascending chime | ~600ms | -12 dB |

- **Library:** Howler.js (handles iOS / Safari autoplay quirks, ~3KB gzipped)
- **Assets:** sourced from freesound.org (CC0) or generated via ElevenLabs SFX
- **State:** persisted in `localStorage` (key: `portfolio-sound-enabled`)
- **Accessibility:** Disabled entirely when `prefers-reduced-motion: reduce` is set, regardless of toggle state

### 5.4 Reveals on scroll

Text blocks fade in + slide up (16px) when entering viewport. Stagger children by ~40ms for paragraph reveals. Framer Motion `<motion.div>` with `whileInView`.

---

## 6. Pillar 3 — Works in 3D + Rubi featured

### 6.1 Works data structure (extensible)

```js
// src/data/works.js
export const worksData = [
  {
    id: 'rubi',
    title: 'Rubi te paye',
    type: 'mobile',                    // 'mobile' | 'web' | 'tool'
    featured: true,                     // exactly one featured at a time
    year: '2025',
    pitch: 'Application qui vous paie pour qui vous êtes. Contrôle total de vos données, compensation directe à chaque utilisation, sécurité garantie.',
    longDescription: '...',             // shown in detail drawer
    tech: ['React Native', 'Next.js', 'Tailwind', 'Supabase', 'Docker', 'Firebase', 'Java', 'Ruby', 'Kotlin', 'Objective-C', 'SCSS', 'JavaScript', 'HTML', 'Shell'],
    images: [
      '/projects/rubi/screen-1.png',
      '/projects/rubi/screen-2.png',
      '/projects/rubi/screen-3.png',
      '/projects/rubi/screen-4.png',
    ],
    links: {
      live: { url: 'https://apps.apple.com/us/app/rubi-pays-you/id6720740387', label: 'App Store' },
      github: { private: true, reason: 'Projet d\'entreprise' },
    },
  },
  // existing projects (Kasa, Hot Takes, Kanap) migrated from constants.js with type: 'web', featured: false
  // future projects: just append objects here
]
```

### 6.2 Featured project (Rubi) treatment

- **Hero position in Act IV** — camera arrives directly on Rubi
- **4 phone mockups in 3D** — each a rounded box mesh with one screenshot as texture
  - Phone 2 = center, front, full size, slight rotateY
  - Phones 1 & 3 = flanking, smaller, rotateY ±15°
  - Phone 4 = back-right, smallest, opacity 0.85
- **Idle animation:** subtle vertical levitation (sine wave, ~3s period) + slow Y-axis rotation
- **DOM overlay** (Framer Motion): pitch text, tech badges, "App Store ↗" primary CTA, "Détails" secondary CTA, "Code source privé" note
- **Tech badges:** all 14 techs shown, wrapped in flex

### 6.3 Non-featured projects (Kasa, Hot Takes, Kanap, future)

- After Rubi, camera pans laterally to a carousel of project cards
- Each card = a 3D plane (or low-poly browser/phone frame) with screenshot texture
- Layout: 3 visible at a time on desktop (1 active center + 2 flanking), scroll/swipe to navigate
- Hover: card rotates toward cursor (subtle tilt)
- Tap/click → opens detail drawer

### 6.4 Detail drawer

- Side drawer slides in from the right (60% viewport width on desktop, 100% on mobile)
- Glassmorphic background (rgba + backdrop-blur)
- Contents: full image gallery (carousel inside drawer), long description, tech stack, year, links
- Three.js scene behind: light zoom + blur as drawer opens
- Close: X button, click outside, or Escape key

### 6.5 Mobile rendering for Act IV

- No camera pan — vertical stack of projects, Rubi on top with single screen (largest), swipe horizontally to see the 3 other Rubi screens
- Project cards stack vertically below, simple 3D tilt on hover (or static on touch devices)

### 6.6 Rubi assets — file relocation

Current location: `Rubi1.png`, `Rubi2.png`, `Rubi3.png`, `Rubi4.png` at project root.

**Target location: `public/projects/rubi/screen-1.png` through `screen-4.png`.**

Reason: Three.js textures need accessible URLs at runtime. With Vite, files in `public/` are served at root URL (e.g. `/projects/rubi/screen-1.png`), which matches the path used in `worksData` (§6.1). Files in `src/assets/` get bundled and hashed, which is fine for `<img>` tags but adds friction for dynamic texture loading.

During implementation: `mv` the 4 files, update `worksData` if path differs from the spec.

---

## 7. Performance, accessibility, fallbacks

### 7.1 Performance budget

- Target: 60fps on desktop (≥ 2018 hardware), 30fps on mobile (≥ 2020 hardware)
- Lighthouse Performance score: > 80 on desktop, > 60 on mobile
- LCP: < 2.5s on 4G
- Bundle: target < 800KB JS gzipped (the current 1.2MB will need code-splitting per-act)

### 7.2 Accessibility

- `prefers-reduced-motion: reduce` → disables Lenis smooth scroll, disables scroll-driven 3D camera, disables sound entirely, replaces transitions with instant
- All interactive elements keyboard-accessible
- Focus states preserved (visible focus ring, not just cursor magnetism)
- Color contrast: text on dark background ≥ WCAG AA (4.5:1)
- Alt text on all project images, sound toggle has `aria-label`

### 7.3 Mobile (< 768px) summary

- Lenis still active (smooth scroll works on touch)
- 3D scene runs with reduced particle count and lower DPR
- Sound toggle visible but defaults OFF (mobile data savings + interruption avoidance)
- Detail drawer becomes full-screen overlay instead of side drawer

---

## 8. Implementation phasing (overview, not the plan itself)

The implementation plan (written separately in a follow-up step) will break this into stages:

1. **Foundation:** Lenis setup, single global canvas refactor, scroll progress hook
2. **Act I:** Hero with new dissolve-ready PC scene
3. **Act II-III:** Identity + Craft scenes with camera keyframes
4. **Act IV:** Works data refactor, Rubi featured 3D component, carousel
5. **Act V:** Trust + Contact consolidation, Earth pull-back
6. **Pillar 2:** magnetism hook, sound system, toggle UI
7. **Polish:** transitions, mobile optimization, accessibility audit, perf audit

The plan will include test strategy, milestones, and review checkpoints per stage.

---

## 9. Out of scope (explicitly)

- Custom cursor (decided against)
- "Signature moment" beyond what the 3 pillars already create (no live AI agent in hero, no separate gimmick)
- Loading screen / cinematic intro (current hero is the entry point)
- Page transitions to other routes (single-page experience)
- Internationalization (stays in current FR / EN mix)
- CMS integration for works data (stays in code, simple to edit)

---

## 10. Open items to resolve at implementation kickoff

- Confirm exact sound assets (find or generate before coding the sound system)
- Confirm Rubi `longDescription` copy (user to provide if they want more than the short pitch)
- Confirm camera keyframe positions after first prototype (will likely need iteration)
- Decide whether Kasa / Hot Takes / Kanap need any data refresh (descriptions, images) — currently using existing assets in `src/assets/`
