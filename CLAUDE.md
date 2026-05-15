# CLAUDE.md

Project context and load-bearing patterns for future Claude sessions on this repo. Keep this short and scannable — for deep details, see [README.md](README.md) (English) or [README.fr.md](README.fr.md) (French).

## Project basics

- **Repo**: [Tintgire/Portfolio-Hugo](https://github.com/Tintgire/Portfolio-Hugo), single branch `main`
- **Live**: [portfolio-hugo-ten.vercel.app](https://portfolio-hugo-ten.vercel.app) — Vercel auto-deploys on push to `main`
- **Owner**: Hugo Boidin — speaks French, prefers FR for discussions
- **Stack**: React 18.2 · Vite 4.3 · Tailwind 3.3 · Three.js / R3F · Framer Motion 10 · Lenis 1.3 · Web Audio API · EmailJS

## Working with this repo

- `yarn dev` → Vite on `http://localhost:5173`. The Claude Preview MCP is configured under `vite-dev` in `.claude/launch.json`.
- The preview server runs **26 WebGL canvases** (Hero + Earth + 13 tech balls, × 2 from `React.StrictMode`). `preview_screenshot` often times out at 30 s — prefer `preview_eval` for DOM/CSS checks, screenshot only when you actually need a visual.
- `.env.local` holds EmailJS credentials (`VITE_EMAILJS_SERVICE_ID`, `_TEMPLATE_ID`, `_PUBLIC_KEY`). It's **gitignored**. `.env.example` documents the required keys. Vercel has the same vars in Environment Variables.
- `git user.email` is `boidinhugo14@gmail.com`. The user usually wants commits pushed to `main` straight after; ask only if the change is risky.

## Layout patterns to reuse

- **Equal-height cards in a row → CSS Grid, never `flex-wrap`**. `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` gives deterministic row heights via intrinsic sizing. The `h-full` chain on flex-wrapped cards proved unreliable across browsers — repeated bug source.
- **Stacking-context escape → `createPortal(..., document.body)`**. Used by `ProjectDrawer`, `SoundPrompt`, and the mobile nav overlay. Section wrappers set `relative z-0`, so anything that needs to paint above later sections must portal out.
- **Mobile split for full-bleed canvases**: when a 3D canvas covers the viewport on mobile and overlays text, don't fight z-index — split the section vertically. See `Hero.jsx`: canvas at `top: 45%, bottom: 90px`, title in the top half, scroll-arrow in the freed bottom strip. Desktop reverts to full-screen overlay.
- **Mobile timeline rail**: `RailFill` repositions from `left-1/2` (desktop center column) to `left-3` (mobile left gutter). Cards take `pl-8 lg:pl-0` to clear it. No per-card dots — the rail's gradient leading edge is the marker.

## Animation gotchas (learned the hard way)

- **`AnimatePresence mode="wait"` can leave stale content** when the wrapped child's `key` changes mid-exit. The Contact wizard had this bug (step counter showed 02/03 with step 1 still rendered). Replace with a plain `motion.div key={x}` and let React handle unmount/remount.
- **`framer-motion` `whileHover` conflicts with Tailwind hover transforms** when they share the same element. After hover release, framer-motion restores the entrance's `variants` transform (with its delay). Fix: split into two elements — outer `motion.div` for entrance, inner `<article>` with CSS `hover:-translate-y-2`.
- **iOS Safari re-rasterizes `blur-3xl` on every scroll frame** when the element is composited with a transform/opacity. Visible as a flicker on the corner glow halos. Fix: `transform: translateZ(0)` + `will-change: transform` to lock it on its own GPU layer.
- **Lenis intercepts wheel events globally** — for nested scroll areas (drawers, modals), add `data-lenis-prevent` to the scrolling element AND call `lenis.stop()` while it's open via `useLenis()`.
- **`useScroll()` from framer-motion misses Lenis scrolls** (it relies on native scroll events that Lenis swallows). Use `useScrollProgress(ref)` from `lib/hooks/` instead — it bridges Lenis's `on('scroll')` into a framer-motion `MotionValue`.

## Form patterns

- **Auto-focus an input → `focus({ preventScroll: true })`** + a `useRef(true)` "first-render" guard. Without this, focusing an off-screen input makes the browser scroll-into-view and the user lands mid-page on reload.
- **Reload-to-top requires both**: `window.history.scrollRestoration = 'manual'` AND `window.scrollTo(0, 0)` in the entry file before React mounts. Browsers default to restoring the previous scroll position.

## Audio system (`src/lib/audio/uiSounds.js`)

- Module-level singleton: `soundEnabledState` lives in the module closure. Refresh → re-import → state resets → opt-in prompt re-appears. **Don't** add `localStorage` — the design is intentional.
- Cross-component sync uses a `CustomEvent('portfolio:sound-enabled-change')` dispatched from `setSoundEnabled`. The navbar's `SoundToggle` listens and re-reads. No Context.
- 4-layer scroll-gated soundtrack: `drone` (0%), `plucks` (25%), `breath` (50%), `bells` (when the Rubi card enters viewport with extended `rootMargin: '99999px 0px 0px 0px'` so it stays on). Lookahead scheduler at 50 ms tick / 100 ms horizon for sample-accurate timing.
- `AudioContext.resume()` is armed via a one-shot listener on first interaction (`armResumeOnInteraction()`).

## Mobile responsiveness mental model

When a section looks broken on mobile, check these in order:
1. **Horizontal overflow** — `document.body.scrollWidth > window.innerWidth`. Usually framer-motion entrance animations starting off-screen (e.g. `fadeIn('right')` with `x: 100`). `body { overflow-x: clip }` rescues most cases but not all (iOS Safari).
2. **Z-index / overlap** — full-bleed 3D canvases vs text. Don't crank z-index; split the layout.
3. **Tap targets < 44 px** — the Contact wizard's `← Retour` button and the social strip's text-only links are below WCAG 44 × 44 minimum. Known, not yet fixed.
4. **Card heights uneven** — switch the parent from `flex flex-wrap` to `grid grid-cols-X`.

## Recent significant changes (chronological)

1. About service cards → Variant C cinematic with taglines, uniform `h-full min-h-[260px]`
2. Works cards → CSS Grid + `mt-auto` for tag pinning
3. Feedbacks → bento + infinite slow marquee, real testimonials (Jessy / Raphaël / Lou) with photos
4. Contact → conversational wizard (3 steps), EmailJS via env vars, click-to-copy email
5. Reload-to-top + `preventScroll` focus
6. Responsive audit + fixes: Hero text/3D split, mobile navbar overlay, mobile timeline rail (no dots), DrawerGallery thumbnail auto-scroll, FreshStock card blur-flicker fix, 3D centering (`x: -2.5`), scroll-arrow below the desk

## What not to do here

- Don't reintroduce flex-wrap for card grids — Hugo will notice the height mismatch.
- Don't wrap step-based form content in `AnimatePresence mode="wait"`.
- Don't commit `.env.local` (already gitignored).
- Don't add `localStorage`/`sessionStorage` for sound state — module memory is the spec.
- Don't push to `main` without confirming if the change is risky (visual regressions, payment paths, deploy config).

## Style direction

Cosmic cinematic — deep `#050211` background, `#915EFF` violet → `pink-500` gradients, white→pink-300→purple-400 gradient text on headings. Premium and tactile: magnetic CTAs, click acknowledgments, layered scroll soundtrack. Stick to this aesthetic when proposing new components.
