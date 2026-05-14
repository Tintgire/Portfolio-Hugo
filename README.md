# PORTFOLIO HUGO

> 🇬🇧 **English** · 🇫🇷 [Lire en français](README.fr.md)

Personal portfolio of **Hugo Boidin** — AI Product Engineer, full-stack & mobile, automation & AI agents.

Cosmic-cinematic direction, scroll-layered procedural soundtrack, 3D Hero scene, smooth-scrolled, sound-aware. Built to be "Game Awards-grade" — premium, tactile, and slightly delirious.

**Live** · [portfolio-hugo-ten.vercel.app](https://portfolio-hugo-ten.vercel.app) _(deployed on Vercel — auto-deploy from `main`)_

![React](https://img.shields.io/badge/React-18.2-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.3-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.152-000?logo=threedotjs&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10-FF0080?logo=framer&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38BDF8?logo=tailwindcss&logoColor=white)
![Lenis](https://img.shields.io/badge/Lenis-1.3-000?logoColor=white)
![Web Audio](https://img.shields.io/badge/Web_Audio-API-orange?logo=javascript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000?logo=vercel&logoColor=white)

---

## ⚡ Stack

### Core

- **[React 18.2](https://react.dev)** — concurrent features, function components, hooks
- **[Vite 4.3](https://vitejs.dev)** — dev server, ES modules, Rollup-based production build (migrated from CRA, see _Engineering decisions_)
- **[React Router 6.11](https://reactrouter.com)** — single-route SPA, ready to extend to per-project pages
- **[Tailwind CSS 3.3](https://tailwindcss.com)** — utility-first styling, custom theme tokens for the cosmic palette
- **[Sass 1.62](https://sass-lang.com)** + **[styled-components 5.3](https://styled-components.com)** — kept for legacy modules, rest is Tailwind

### Animation & motion

- **[Framer Motion 10.12](https://www.framer.com/motion/)** (`framer-motion`) — `useScroll`, `useTransform`, `useMotionValue`, `useSpring`, `AnimatePresence` for the project drawer + sound prompt, viewport-driven reveals
- **[Lenis 1.3](https://lenis.darkroom.engineering)** — buttery smooth wheel-scroll, exposed via a React Context (`LenisProvider`) so any component can call `lenis.stop()` / `lenis.start()` and the music driver can subscribe to scroll
- **[react-tilt](https://github.com/mkosir/react-tilt)** — 3D tilt on the secondary project cards
- **`useMagneticHover`** — custom hook that pulls a button toward the cursor via spring-smoothed motion values; bypasses on `prefers-reduced-motion`

### 3D / WebGL

- **[Three.js 0.152](https://threejs.org)** — base 3D engine
- **[@react-three/fiber 8.13](https://r3f.docs.pmnd.rs)** — React renderer for Three
- **[@react-three/drei 9.66](https://drei.pmnd.rs)** — `useGLTF`, `Preload`, `PerspectiveCamera`, `Points`, `PointMaterial`, `OrbitControls`
- **[maath](https://github.com/pmndrs/maath)** — `random.inSphere` for the Hero violet-particle cloud
- **`@mediapipe/tasks-vision`** — pinned for upcoming face-aware experiments

### Audio

- **Web Audio API** (no extra lib) — synthesized UI sounds and a four-layer scroll-driven ambient soundtrack (`src/lib/audio/uiSounds.js`)
- Custom **lookahead scheduler** (50 ms tick, 100 ms horizon) for sample-accurate note timing on the music layers
- All layers gated by total scroll progress — `MusicScrollDriver` bridges Lenis (or window scroll fallback) into `setMusicProgress(0..1)`

### Forms & integrations

- **[EmailJS 3.11](https://www.emailjs.com)** — contact form sends without a backend
- Project data is plain JS in `src/constans/index.js` — easy to extend, no headless CMS

### Tooling

- **[Vite](https://vitejs.dev)** — dev + build (`vite`, `vite build`, `vite preview`)
- **[PostCSS](https://postcss.org)** + **[autoprefixer](https://github.com/postcss/autoprefixer)** — Tailwind pipeline
- **`@testing-library/react`** — present, ready for component tests

---

## 🌐 Hosting & infrastructure

| Service                                                          | Role                                                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **[Vercel](https://vercel.com)**                                 | Production deployment, edge CDN, automatic preview per push, auto-deploy from `main`  |
| **[GitHub](https://github.com/Tintgire/Portfolio-Hugo)**         | Source control, single source of truth                                                |
| **[gleitz / midi-js-soundfonts](https://gleitz.github.io)**      | Was tried for real GM samples, rolled back — current music is fully synthesized       |

---

## 🎨 Visual & interaction features

### Hero

- **3D PC scene** — `Computers.gltf` model rendered via React Three Fiber, with a **cinematic camera** (`CinematicCamera.jsx`) that lerps from `[20, 3, 5]` to `[12, 6, 12]` driven by `window.scrollY`, with a subtle `sin/cos` sway on the clock
- **HeroParticles** — 800 (desktop) / 400 (mobile) violet (#915EFF) particles sampled via `maath/random.inSphere`, slow-rotating; gated by `useReducedMotion`
- **Scroll fade-out** — the entire 3D hero fades to opacity 0 over 60 vh of scroll using `useScroll` + `useTransform`
- **Typing animation** — "Hi, I'm Hugo / AI Product Engineer / Full-Stack & Mobile / Automation & AI Agents", with a CSS `@keyframes blink` cursor that mimics a desktop terminal

### Navbar

- Responsive subtitle that progressively reveals roles by breakpoint (`sm`, `lg`, `xl`)
- **`SoundToggle`** chip on the left of the nav links — speaker-on / speaker-off SVG with `aria-pressed`, magnetic hover, syncs across the app via `CustomEvent`

### Works — featured projects

- **`FeaturedProject`** is a single component with two `mockup` variants:
  - **`phones`** (default) — four iPhone-styled mockups stacked in 3D (`rotateY`, `rotateZ`, scale, opacity, `perspective: 1000px`), gentle `y` float animation
  - **`browser`** — single laptop-style frame, macOS traffic-light dots in the chrome bar, URL pill, 16:10 screenshot
- **CTAs** — magnetic hover (`useMagneticHover`), click triggers `playClick` and opens the project drawer
- Optional `ctaLabel` override per project for clean French elision (`Voir sur l'App Store ↗` vs `Voir sur le site ↗`)

### Project drawer

- **`ProjectDrawer`** is portaled to `document.body` via `createPortal` — escapes the section's `relative z-0` stacking context that was making it paint behind later sections
- Side-panel slide-in (`x: '100%'` → `x: 0`) with backdrop blur
- `data-lenis-prevent` on the panel — Lenis intercepts wheel events globally, this attribute returns wheel control to the native overflow on the panel
- Calls `lenis.stop()` on open via the `useLenis()` hook — page behind doesn't drift while reading
- **Focus trap** — focuses the close button on mount, restores previous focus on unmount, Escape closes
- **`DrawerGallery`** — 16:10 hero image + thumbnail strip, `AnimatePresence` cross-fade on active change, optional `imagePositions` array per project for per-image `objectPosition` tuning

### Sound design

The site has two audio layers that work together:

**1. UI sounds** — short synthesized cues (`tone()`, `sweep()` helpers in `uiSounds.js`):

| Trigger                                  | Sound                                    |
| ---------------------------------------- | ---------------------------------------- |
| Project card click                       | `playClick` — 880 Hz sine + delayed 1320 Hz overtone |
| Drawer open                              | `playDrawerOpen` — dual sweep 320→880 Hz sine + 480→1100 Hz triangle |
| Drawer close (Escape, ×, backdrop)       | `playDrawerClose` — descending sweep 880→280 Hz sine |
| Sound toggle ON                          | `playToggle` — two-note 660→990 Hz confirmation |
| Gallery thumbnail change                 | `playTick` — short 1320 Hz tick          |
| Experience timeline card enters viewport | `playTick`                               |
| Contact form submit success              | `playSubmit` — C5 → E5 → G5 success arpeggio |

**2. Scroll-layered ambient soundtrack** — a four-voice score in C minor that builds as the user scrolls:

| Layer    | Trigger                                      | Synth                                                              |
| -------- | -------------------------------------------- | ------------------------------------------------------------------ |
| `drone`  | 0% scroll                                    | C2 + G2 + Eb3 + C4 sine chord, per-voice slow LFO breathing        |
| `plucks` | 25% scroll                                   | Triangle arpeggio in C minor at 60 BPM, lookahead-scheduled        |
| `breath` | 50% scroll                                   | Detuned-triangle pad with 0.1 Hz swell LFO (chord drifts in / out) |
| `bells`  | When the Rubi card enters the viewport       | Sine + 2× harmonic melody, sparse, stays on to the bottom of page  |

Layers fade in / out symmetrically — scrolling back above a threshold triggers a 2 s fade-out.

**Activation** — a centered modal (`SoundPrompt`) appears 1.5 s after every fresh page load, asking the user to opt in. Sound state is held in module memory (no `localStorage`, no `sessionStorage`) — guaranteed reset on every refresh, so the user always re-confirms.

### Contact

- **3D Earth** — GLTF model rendered via React Three Fiber, `OrbitControls` constrained to horizontal rotation, `autoRotate`, with violet rim and pink fill directional lights for the cosmic vibe
- Contact form sends via **EmailJS** — `playSubmit` arpeggio fires on success

### Cross-cutting

- **`prefers-reduced-motion`** — Lenis bypasses, particles skip rotation, magnetic hover bails out, sound is force-disabled
- **Mobile-aware** — `useIsMobile` hook switches particle count, simplifies layouts
- **Portal pattern** — drawers and the sound modal both portal to `document.body` to escape stacking contexts created by section wrappers

---

## 🧠 Engineering decisions / skills demonstrated

- **CRA → Vite migration** — kept the dependency graph, rewrote the entry to `index.html` + `src/index.jsx`, renamed JSX files, added `vercel.json` with explicit `framework: "vite"` + `outputDirectory: "dist"`
- **Module-level audio state** instead of storage — `soundEnabledState` lives in the `uiSounds` module closure. Page reload re-imports the module → state resets → `SoundPrompt` shows again. Simple, no race conditions with bfcache, no need to reason about session vs local storage semantics.
- **`CustomEvent`-based cross-component sync** — `setSoundEnabled` dispatches `portfolio:sound-enabled-change`. The navbar `SoundToggle` listens and re-reads state. No Context, no props drilling for a single boolean.
- **Web Audio lookahead scheduler** — every 50 ms, queue all notes whose start time falls within the next 100 ms. Sample-accurate note onset regardless of main-thread jitter. All four music layers share one `globalStartTime` so beats stay in phase when a layer joins mid-song.
- **`AudioContext.resume()` on first interaction** — `armResumeOnInteraction()` registers a one-shot listener on `click` / `keydown` / `scroll` / `touchstart` / `pointerdown`. The drone is created the moment the user opts in, but only becomes audible once the autoplay policy lets it; no ambiguous "did sound work?" UX.
- **Lenis ↔ React bridge** — `LenisProvider` exposes the instance via Context. `MusicScrollDriver` subscribes to `lenis.on('scroll', …)` on desktop and falls back to `window.scroll` for reduced-motion users. `ProjectDrawer` calls `lenis.stop()` on open and adds `data-lenis-prevent` so wheel events bubble back to the native overflow.
- **Portal escape pattern** — `ProjectDrawer` and `SoundPrompt` portal to `document.body`. Without this they were trapped behind later sections (the `Feedbacks` section paints _on top_ of a drawer that lives inside the `Works` section because both have `relative z-0`).
- **Framer-motion vs Tailwind transform conflict** — `motion.*` components take over the `transform` CSS property, so `-translate-x-1/2 -translate-y-1/2` silently breaks. The `SoundPrompt` uses a `position: fixed inset-0 flex items-center justify-center` wrapper instead, and the inner `motion.div` is a normal flow child.
- **IntersectionObserver with extended `rootMargin`** — bells use `rootMargin: '99999px 0px 0px 0px'`. Once the Rubi card has entered the viewport, the extended top edge keeps it intersecting forever as the user scrolls past — bells stay on to the bottom of the page, fade out only when scrolling back above.
- **Per-image `objectPosition`** — `DrawerGallery` accepts an `imagePositions` array on the project shape; one of the Rubi screenshots had its content packed at the bottom and `object-cover center` was hiding it.
- **Phones-mockup width fix** — the 4-iPhone container had an absolute-positioned children-only layout, so without an explicit `width` it shrank to 0 and the percentages collapsed to the right edge. Setting `w-full max-w-[420px]` restores the 4-stack spread.

---

## 🎭 Style direction

Cosmic cinematic. Dark, deep purple, gradient accents fading to pink. Premium and tactile — every CTA pulls toward the cursor, every click is acknowledged, the music thickens as the scroll progresses.

### Palette

| Token                  | Value     | Use                                              |
| ---------------------- | --------- | ------------------------------------------------ |
| `primary`              | `#050211` | Page background — deep night                     |
| Featured card top      | `#1a0a35` | Top of the gradient on featured project cards    |
| Featured card mid      | `#2a1156` | Middle of the gradient                           |
| `#915EFF`              | violet    | Primary accent — particles, borders, focus rings |
| `pink-500` (Tailwind)  | `#ec4899` | Secondary accent — live dot, gradient end        |
| `purple-300/40`        | overlay   | Soft borders on dark surfaces                    |

### Typography

- Headings — `font-black`, `tracking-tight`, `bg-clip-text` on a `from-white via-pink-300 to-purple-400` gradient
- Body — Tailwind defaults, `text-white/85` for primary, `text-white/55` for muted
- Tech / metadata — `text-[10px] tracking-[0.3em] uppercase` for that editorial-tech vibe

---

## 🗂 Project structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Experience.jsx              # Vertical timeline + per-card playTick on viewport-enter
│   ├── DownloadSection.jsx         # CV / diploma download
│   ├── Tech.jsx
│   ├── Works.jsx                   # Featured + secondary cards, project drawer mount
│   ├── Feedbacks.jsx
│   ├── Contact.jsx                 # EmailJS form + Earth canvas
│   ├── SoundToggle.jsx             # Navbar chip, listens to sound-enabled events
│   ├── SoundPrompt.jsx             # Centered "Active le son" modal on every load
│   ├── canvas/
│   │   ├── Computers.jsx           # Hero PC scene + cinematic camera + particles
│   │   ├── CinematicCamera.jsx     # Scroll-driven camera lerp + sway
│   │   ├── HeroParticles.jsx       # Violet particle cloud
│   │   ├── Earth.jsx               # Contact 3D earth with rim lighting
│   │   └── Stars.jsx
│   └── works/
│       ├── FeaturedProject.jsx     # Phones mockup OR browser mockup variant
│       ├── ProjectDrawer.jsx       # Portaled side panel with focus trap
│       └── DrawerGallery.jsx       # Hero image + thumbnail strip
├── lib/
│   ├── LenisProvider.jsx           # Lenis context, prefers-reduced-motion bypass
│   ├── MusicScrollDriver.jsx       # Bridges Lenis scroll → setMusicProgress
│   ├── audio/
│   │   └── uiSounds.js             # All synth UI sounds + 4-layer scroll soundtrack
│   └── hooks/
│       ├── useReducedMotion.js
│       ├── useIsMobile.js
│       ├── useScrollProgress.js
│       ├── useMagneticHover.js
│       └── useSoundToggle.js       # Listens to sound-enabled CustomEvent
├── constans/
│   └── index.js                    # Projects, experiences, testimonials data
├── pages/
│   └── Home/
│       └── Home.jsx
├── App.jsx
└── index.jsx                       # Mount + LenisProvider wrap
public/
└── projects/
    ├── rubi/                       # 4 mobile screenshots
    └── lou/                        # 5 desktop screenshots
```

---

## 🛠 Scripts

```bash
yarn dev        # start Vite dev server on http://localhost:5173
yarn build      # production build → dist/
yarn preview    # serve the production build locally
```

---

## 📦 Featured projects

Two showcased projects in the Works section:

### Rubi te paye — _mobile_

iOS app that pays users for their personal data. Granular consent, in-app wallet, real-time crediting. JS-end-to-end stack centered on Firebase + GCP, with Memgraph/Neo4j for the relationship graph and Stripe for payments. Disponible sur l'[App Store](https://apps.apple.com/us/app/rubi-pays-you/id6720740387) — code source privé.

### Lou Studio — _editorial web_

Brutalist editorial portfolio for [Lou Boidin](https://www.instagram.com/lou.boidin/), Paris-based makeup artist & stylist. Cinematic scroll, custom Three.js iPhone with `DecalGeometry` texture projection, bilingual FR / EN. Live at [portfolio-lou-six.vercel.app](https://portfolio-lou-six.vercel.app/fr) — source at [Tintgire/Portfolio-Lou](https://github.com/Tintgire/Portfolio-Lou).

---

## 📫 Contact

- **Email** — [boidinhugo14@gmail.com](mailto:boidinhugo14@gmail.com)
- **GitHub** — [@Tintgire](https://github.com/Tintgire)

---

## ©

All rights reserved. Code is public for portfolio review purposes; the project is not licensed for redistribution or reuse.
