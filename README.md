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

### Feedbacks — bento + infinite marquee

- **Bento layout** — one featured testimonial (`lg:col-span-3`) with a violet→pink gradient background and a corner pink-glow halo, sidebar of two compact cards (`lg:col-span-2`) stacked vertically
- **Infinite slow marquee** — testimonials list is doubled (`[...testimonials, ...testimonials]`) and translated `-50%` over 40 s in a pure CSS `@keyframes testimonial-marquee` loop, edges fade via a mask gradient (`testimonial-marquee-wrap` with left/right fade), pauses on hover, full bypass under `prefers-reduced-motion`
- Card footer (avatar + name + role) is bottom-aligned with `mt-auto` so cards of varying quote length still align horizontally
- Role label adapts: `${designation} chez ${company}` if `company` is set, otherwise just `${designation}` (so freelancers without a company don't render a dangling "chez")

### Contact — conversational wizard

- **Typeform-style flow** — 3 steps animated with `motion.div key={step}` (deliberately **not** wrapped in `AnimatePresence` — its `mode="wait"` was leaving stale step content in the DOM): name → email → composite (subject chips + message textarea)
- Step 2 title is personalized: `Enchanté ${firstName}, comment je peux te joindre ?`
- **Subject chips** — Recrutement / Projet freelance / Collab / Autre, toggle on/off, prepended to the email body as `[Sujet : X]`
- Per-step `validate` function, inline error toast, success state replaces the form for 4 s before resetting
- **`focus({ preventScroll: true })`** on auto-focus + `isFirstRender` ref guard so the page doesn't jump to the form on initial load
- **Click-to-copy email** in the ContactsStrip — `navigator.clipboard.writeText(SOCIAL.email)`, transient "Copié !" feedback for 2 s (no `mailto:` fallback — more universal, no native client required)
- **3D Earth** — GLTF model, `OrbitControls` constrained to horizontal rotation, `autoRotate`, violet rim + pink fill lights; the step-content area is `min-h-[320px]` so the Earth canvas mirroring its height with `xl:h-auto` doesn't grow when step 3 introduces the longer composite layout
- Submits via **EmailJS** using `import.meta.env.VITE_EMAILJS_*` env vars (Vite injects at build time, credentials live in `.env.local` locally and Vercel Environment Variables in prod)

### Mobile responsiveness

- **Hero split** — on `<sm`, the 3D canvas is restricted to a middle band (`top: 45%`, `bottom: 90px`) so the title text sits cleanly above and the scroll-down arrow has its own strip below; on `sm+` the canvas reclaims the full section and the text overlays it (original cinematic look)
- **Navbar overlay** — burger morphs into an X (two bars rotate via framer-motion), portal-rendered full-screen overlay with a radial violet gradient + `backdrop-blur(14px)`, the 3 nav links render in `text-5xl` with the white→pink→purple gradient + stagger entry (`delay: 0.1 + i * 0.08`), social footer (Email / LinkedIn / GitHub pill buttons) at the bottom, Escape closes, body scroll locked while open
- **Experience timeline rail on mobile** — the desktop `RailFill` now also renders on mobile, repositioned from the dead-center column (`left-1/2`) to a left gutter (`left-3`). Cards get `pl-8 lg:pl-0` to clear the rail. No per-card dots — the rail's gradient leading edge is the scroll position marker
- **Equal-height card grids** — `About` services, `Works` secondary projects and `Feedbacks` sidebar all use CSS Grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) instead of `flex-wrap` so cards in the same row are guaranteed the same height via grid's intrinsic row sizing (an `h-full` chain on flex-wrapped cards turned out to be unreliable across browsers)
- **DrawerGallery thumbnail auto-scroll** — `useEffect(activeIndex)` calls `scrollIntoView({ inline: 'center' })` on the active thumb so the violet selection border stays visible when the strip overflows horizontally on narrow screens

### Cross-cutting

- **`prefers-reduced-motion`** — Lenis bypasses, particles skip rotation, magnetic hover bails out, sound is force-disabled, marquee animation disabled
- **Mobile-aware** — `useIsMobile` hook switches particle count, simplifies layouts, shifts the 3D PC `x` further left to counter the camera's right-bias
- **Portal pattern** — drawers, sound modal, and the mobile nav overlay all portal to `document.body` to escape stacking contexts created by section wrappers
- **Reload-to-top** — `index.jsx` forces `history.scrollRestoration = 'manual'` + `window.scrollTo(0, 0)` so F5 always lands on the hero (browsers default to restoring the previous scroll position, which broke the intended "land on the title" experience)

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
- **CSS Grid > flex-wrap + h-full chain for equal heights** — flex-wrap is rendering-engine-dependent for cascading `h-full` (it broke between Chromium and WebKit), CSS Grid's intrinsic row sizing is deterministic. Used for About service cards, Works secondary cards, and Feedbacks sidebar.
- **`AnimatePresence` `mode="wait"` leaves stale content** — wrapping the wizard step content in `AnimatePresence mode="wait"` was leaving the previous step's DOM in place when `key` changed (visible bug: step counter showed 02/03 with step 1's input still rendered). Replaced with a plain `motion.div key={step}` — React handles the unmount/remount, framer-motion plays the entrance animation, no race condition.
- **`framer-motion` entrance vs Tailwind `hover` transform conflict** — `whileHover` + a `variants`-based entrance share the same `transform` matrix. After hover release, framer-motion restores the entrance's variants transform (which includes the delay), so the card "freezes" at the lifted position for `0.15 * index` seconds before falling back. Fix: split into two elements — outer `motion.div` for entrance only, inner `<article>` with pure CSS `hover:-translate-y-2`. Transforms on separate elements don't conflict.
- **iOS Safari `blur-3xl` re-rasterization flicker** — large CSS blurs on translated elements are re-rasterized on every scroll frame on iOS, visible as a flicker in the corner glow halos of `FeaturedProject` cards. Promoted the halos to their own compositor layer with `transform: translateZ(0)` + `will-change: transform` — the GPU keeps the rasterized blur tile cached.
- **`focus({ preventScroll: true })` for auto-focus** — auto-focusing the wizard's first input on mount made the browser scroll the form into view, jumping the user past the hero. The `preventScroll` option keeps focus without triggering `scrollIntoView`. Belt-and-braces: an `isFirstRender` ref also skips the focus call on the very first mount.
- **Manual `scrollRestoration` for reload-to-top** — browsers default to `scrollRestoration: 'auto'` which restores the previous scroll position on F5. Combined with the cinematic typewriter that's meant to play on first paint, this broke the intended "land on the hero" experience. Setting `window.history.scrollRestoration = 'manual'` and calling `window.scrollTo(0, 0)` in the entry file before React mounts forces a top-of-page landing on every reload.
- **EmailJS via `import.meta.env.VITE_*`** — credentials shipped in source were a smell (even though the public key is shipped in the bundle anyway, baking it into the repo means rotation requires a commit). Moved to `.env.local` (gitignored) for local dev and Vercel Environment Variables for prod. `.env.example` documents the 3 required keys for future contributors.
- **Hero mobile split layout** — the 3D PC canvas was covering the title text on mobile (the GLTF fills the whole 375 px viewport). First tried `z-index: 10` on the title — that just flipped the problem (title now covered the desk). Real fix: keep both visible by splitting the section vertically — canvas `top: 45%, bottom: 90px`, title in the top half, scroll-down arrow in the freed `90 px` strip below the canvas. Desktop is untouched (canvas full-screen, title overlay).
- **3D model centering on mobile** — the GLTF + camera combo has an inherent right-bias: the camera sits at `x: 20` (perspective skew) and the desk model is asymmetric (the PC tower sits to the right of the monitor). Counter-shifted the model `x: -2.5` on mobile only — desktop keeps `x: 0` because the full-screen canvas masks the bias.
- **Mobile timeline rail without dots** — adapted the desktop `RailFill` to mobile by repositioning from column-center (`left-1/2`) to a fixed left gutter (`left-3`). First iteration added per-card dots aligned on the rail; they felt visually disconnected from the cards. Removed them entirely — the rail's gradient leading edge already marks scroll position, and the cards themselves are the milestones.
- **`DrawerGallery` thumbnail auto-scroll** — on narrow screens the thumbnail strip overflows horizontally; navigating to the last image left its violet selection border off-screen. `useEffect` on `activeIndex` calls `scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })` on the active button.

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
