# Plan 6 — Magnetism + Sound Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Pillar 2 from the design spec — make key interactive elements feel tactile via two complementary mechanisms:
1. **Magnetic hover** — the element tracks the cursor with a spring offset (max ~10px), feeling "attractive".
2. **Sound design** — subtle click + hover sounds, with a global toggle in the navbar. Sounds are synthesized via the **Web Audio API** (no asset files needed — keeps the deploy clean), but the system is structured so audio files can be swapped in later for a richer pad/ambient layer.

Sound is **OFF by default** (respects browser autoplay policy + user preference). User opt-in via toggle, persisted to `localStorage`. Both magnetism and sound are gated by `useReducedMotion` (auto-disabled when the OS prefers reduced motion).

**Architecture:**
- `src/lib/hooks/useMagneticHover.js` — a hook that attaches `mousemove` / `mouseleave` listeners to a ref and updates a Framer Motion `MotionValue` for `x` and `y`. The element opt-in via `<motion.div ref={ref} style={{ x, y }}>`. Strength + max-offset are configurable.
- `src/lib/audio/uiSounds.js` — a tiny synth-sound module (no React). Exports `playClick()` and `playHover()`. Uses a single shared `AudioContext`, scheduled with envelopes for short transient tones. Mute state is read from `localStorage`.
- `src/lib/hooks/useSoundToggle.js` — a hook that wraps `localStorage` for the mute flag, with `useState` to trigger re-renders.
- `src/components/SoundToggle.jsx` — a small icon button in the navbar to toggle sound on/off. Uses `useSoundToggle` and applies magnetism for consistency.
- Wiring: magnetism applied to Rubi's "App Store" + "Détails du projet" CTAs, Hero scroll cue, navbar links. Click sound on the same CTAs + the contact form submit.

**Tech Stack:**
- Existing: Framer Motion (`useMotionValue`, `useSpring`), Tailwind, React
- No new deps (Web Audio API is built-in)
- No asset files (synth-only) — the user can drop real audio files later by switching `uiSounds.js` from synth to `<audio>` element playback.

**Reference spec:** docs/superpowers/specs/2026-05-13-portfolio-cinematic-redesign-design.md §5

---

### Task 1: Create useMagneticHover hook

**Files:** Create `src/lib/hooks/useMagneticHover.js`

The hook takes a ref + options, returns `{ x, y }` as `MotionValue`s. The consumer wraps its element in `<motion.div style={{ x, y }} ref={ref}>` or `<motion.button ...>`.

Logic:
- On `mousemove` inside the element: compute the offset from the element center. Scale by `strength` (default 0.4), clamp to `max` (default 10px).
- Apply spring smoothing via `useSpring` so the motion isn't jittery.
- On `mouseleave`: spring back to 0,0.
- Bail out entirely if `useReducedMotion()` returns true (sets x/y to 0 motion values).
- SSR-safe (only attaches listeners after mount).

- [ ] **Step 1: Write the hook**

Create `src/lib/hooks/useMagneticHover.js`:

```js
import { useEffect } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from './useReducedMotion'

export function useMagneticHover(ref, { strength = 0.4, max = 10 } = {}) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 180, damping: 18, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 180, damping: 18, mass: 0.6 })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength
      rawX.set(Math.max(-max, Math.min(max, dx)))
      rawY.set(Math.max(-max, Math.min(max, dy)))
    }
    const onLeave = () => {
      rawX.set(0)
      rawY.set(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      rawX.set(0)
      rawY.set(0)
    }
  }, [ref, strength, max, rawX, rawY, reduced])

  return { x, y }
}
```

- [ ] **Step 2: Build**

```bash
npx vite build
```

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/lib/hooks/useMagneticHover.js
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: add useMagneticHover hook for cursor-tracking elements"
```

---

### Task 2: Create uiSounds module (Web Audio synth)

**Files:** Create `src/lib/audio/uiSounds.js`

A tiny synth-sound module. No React. Exports `playClick()` and `playHover()`. Uses a singleton `AudioContext` lazily initialized on first user gesture (browser autoplay policy).

Mute state is read from `localStorage` key `portfolio-sound-enabled` (true/false). Default: disabled. Also auto-disabled when `prefers-reduced-motion` is reduce.

- [ ] **Step 1: Write the module**

Create `src/lib/audio/uiSounds.js`:

```js
const STORAGE_KEY = 'portfolio-sound-enabled'

let ctx = null
function getContext() {
  if (ctx) return ctx
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  return ctx
}

export function isSoundEnabled() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function setSoundEnabled(enabled) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false')
  } catch {
    // ignore
  }
}

function tone({ frequency, duration = 0.08, type = 'sine', volume = 0.08, attack = 0.005, release = 0.04 }) {
  if (!isSoundEnabled()) return
  const c = getContext()
  if (!c) return
  if (c.state === 'suspended') {
    c.resume().catch(() => {})
  }

  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, now)
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + attack)
  gain.gain.linearRampToValueAtTime(0, now + attack + duration + release)
  osc.connect(gain).connect(c.destination)
  osc.start(now)
  osc.stop(now + attack + duration + release + 0.02)
}

export function playClick() {
  // Crystalline tick: short high sine
  tone({ frequency: 880, duration: 0.04, type: 'sine', volume: 0.07, attack: 0.002, release: 0.06 })
  // Follow-up overtone for crispness
  setTimeout(() => tone({ frequency: 1320, duration: 0.03, type: 'sine', volume: 0.04, attack: 0.001, release: 0.04 }), 12)
}

export function playHover() {
  // Soft whoosh: low triangle with quick decay
  tone({ frequency: 220, duration: 0.06, type: 'triangle', volume: 0.04, attack: 0.008, release: 0.08 })
}
```

- [ ] **Step 2: Build**

```bash
npx vite build
```

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/lib/audio/uiSounds.js
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: add uiSounds Web Audio synth (click + hover SFX, localStorage gated)"
```

---

### Task 3: Create useSoundToggle hook + SoundToggle component

**Files:**
- Create: `src/lib/hooks/useSoundToggle.js`
- Create: `src/components/SoundToggle.jsx`

The hook reads/writes the mute state with React re-renders. The component renders a small icon button (volume on/off SVG) for the navbar.

- [ ] **Step 1: Write the hook**

Create `src/lib/hooks/useSoundToggle.js`:

```js
import { useCallback, useEffect, useState } from 'react'
import { isSoundEnabled, setSoundEnabled } from '../audio/uiSounds'

export function useSoundToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(isSoundEnabled())
  }, [])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      setSoundEnabled(next)
      return next
    })
  }, [])

  return { enabled, toggle }
}
```

- [ ] **Step 2: Write the component**

Create `src/components/SoundToggle.jsx`:

```jsx
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useSoundToggle } from '../lib/hooks/useSoundToggle'
import { useMagneticHover } from '../lib/hooks/useMagneticHover'

export default function SoundToggle() {
  const { enabled, toggle } = useSoundToggle()
  const ref = useRef(null)
  const { x, y } = useMagneticHover(ref, { strength: 0.3, max: 6 })

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={toggle}
      aria-label={enabled ? 'Désactiver le son' : 'Activer le son'}
      aria-pressed={enabled}
      style={{ x, y }}
      className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/70 hover:text-white"
    >
      {enabled ? (
        // volume-on (speaker + waves)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        // volume-off (speaker + x)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </motion.button>
  )
}
```

- [ ] **Step 3: Build**

```bash
npx vite build
```

- [ ] **Step 4: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/lib/hooks/useSoundToggle.js src/components/SoundToggle.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: add SoundToggle component (volume icon, magnetic hover)"
```

---

### Task 4: Mount SoundToggle in Navbar

**Files:** Modify `src/components/Navbar.jsx`

Add the toggle to the right side of the navbar, before the burger menu icon on mobile and as a sibling of the nav links on desktop. Reachable on every viewport.

- [ ] **Step 1: Edit Navbar.jsx**

Open `src/components/Navbar.jsx`. Locate the existing `<ul className="list-none hidden sm:flex flex-row gap-10">` block (the desktop nav links). Replace the **wrapping div** that contains both the `<ul>` AND the mobile burger area with a wrapper that holds the SoundToggle alongside the existing structure.

Concrete change: find this region (around lines 32-77, the entire right-side of the navbar after the brand Link):

```jsx
        <ul className="list-none hidden sm:flex flex-row gap-10">
          ...existing list items...
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          ...existing burger menu...
        </div>
```

Wrap them in a flex container with the SoundToggle:

```jsx
        <div className="flex items-center gap-3">
          <SoundToggle />

          <ul className="list-none hidden sm:flex flex-row gap-10">
            ...existing list items unchanged...
          </ul>

          <div className="sm:hidden flex justify-end items-center">
            ...existing burger menu unchanged...
          </div>
        </div>
```

Note the small change to the mobile menu wrapper: drop `flex-1` since the parent flex container now handles right-alignment via the brand Link being `justify-between` partner.

Also at the top of the file, add the import:

```jsx
import SoundToggle from './SoundToggle'
```

- [ ] **Step 2: Build**

```bash
npx vite build
```

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/components/Navbar.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: mount SoundToggle in Navbar"
```

---

### Task 5: Apply magnetism + click sound to Rubi CTAs

**Files:** Modify `src/components/works/FeaturedProject.jsx`

The Rubi card has two CTAs ("Voir sur l'App Store" anchor + "Détails du projet" button). Wrap both in `motion.a`/`motion.button` driven by `useMagneticHover`. Trigger `playClick()` on actual click.

- [ ] **Step 1: Edit FeaturedProject.jsx**

Open `src/components/works/FeaturedProject.jsx`. At the top, add imports:

```jsx
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useMagneticHover } from '../../lib/hooks/useMagneticHover'
import { playClick } from '../../lib/audio/uiSounds'
```

(Adjust the existing `import { motion } from 'framer-motion'` — it's already there. Just add the other 3 lines as new imports.)

Inside the `FeaturedProject` component, before the `return`, add refs + hover hooks:

```jsx
  const liveCtaRef = useRef(null)
  const detailsCtaRef = useRef(null)
  const liveMag = useMagneticHover(liveCtaRef, { strength: 0.35, max: 8 })
  const detailsMag = useMagneticHover(detailsCtaRef, { strength: 0.35, max: 8 })
```

Then in the JSX, replace the existing `<a ... className="...App Store...">` with:

```jsx
            {links?.live && (
              <motion.a
                ref={liveCtaRef}
                href={links.live.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClick()}
                style={{ x: liveMag.x, y: liveMag.y }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs font-bold tracking-wider shadow-lg shadow-pink-500/40 transition-transform"
              >
                Voir sur l'{links.live.label} ↗
              </motion.a>
            )}
```

(Two changes: `<a>` → `<motion.a>`, added `ref`, `onClick`, `style`, and removed the `hover:scale-[1.03]` Tailwind class since the magnetism replaces the scale hover.)

Similarly replace the existing `<button onClick={() => onOpen?.(project.id)}>Détails du projet</button>` with:

```jsx
            <motion.button
              ref={detailsCtaRef}
              type="button"
              onClick={() => {
                playClick()
                onOpen?.(project.id)
              }}
              style={{ x: detailsMag.x, y: detailsMag.y }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-purple-300/40 bg-white/5 text-purple-100 text-xs font-bold tracking-wider hover:bg-white/10 transition-colors"
            >
              Détails du projet
            </motion.button>
```

- [ ] **Step 2: Build**

```bash
npx vite build
```

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/components/works/FeaturedProject.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: magnetic hover + click sound on Rubi CTAs"
```

---

### Task 6: Visual + audio verification locally (controller)

The controller verifies. Start dev server.

1. **Magnetism**: hover near (but not directly on) the Rubi CTAs. The button should slightly "lean" toward the cursor. The motion should be smooth via spring. Releasing the cursor returns the button to center.
2. **SoundToggle in Navbar**: visible in the navbar with a "muted" icon by default. Click → icon switches to "unmuted" + click sound plays. `localStorage` `portfolio-sound-enabled` now `'true'`.
3. **Click sounds**: with sound enabled, clicking "Voir sur l'App Store" plays the crystalline tick. Same for "Détails du projet" (also opens drawer).
4. **Reduced motion**: open DevTools → Rendering → Emulate CSS `prefers-reduced-motion: reduce`. Magnetism should NOT engage. Sound should be auto-disabled even if toggle says enabled.
5. **No console errors**.

---

### Task 7: Deploy and verify production

- [ ] **Step 1: Push**

```bash
git push origin main
```

- [ ] **Step 2: Wait and verify**

```bash
sleep 90 && curl -o /dev/null -s -w "Home: %{http_code}\n" https://portfolio-hugo-ten.vercel.app/
```

Expected: 200.

- [ ] **Step 3: Visual check on production**

- Sound toggle visible in navbar
- Click toggle → state persists across page reload (`localStorage`)
- Magnetism on Rubi CTAs feels responsive

Carry-over regression: hero camera/particles, Earth glow, drawer, smooth scroll — all still working.

---

## Self-Review Notes

**Spec coverage:**
- §5.1 (cursor) — N/A (decided against custom cursor in Plan 1 design phase)
- §5.2 (magnetism) — applied to Rubi CTAs + SoundToggle. Nav links + Hero scroll cue NOT wired in this plan — adding more elements is mechanical and can be a quick follow-up.
- §5.3 (sound design) — synth-only (click + hover); ambient pad + act transition sweep + form submit chime deferred. Toggle works, localStorage persistence works, reduced-motion guard works.
- §5.4 (reveals on scroll) — not in this plan. Most sections already use Framer Motion `whileInView` patterns; can be polished later.

**Not covered (deferred):**
- Ambient pad / cosmic background sound (needs an audio asset file)
- Act-transition "sweep" sound (needs orchestration with scroll position)
- Form submit "chime" (just needs `playClick` or a new tone; quick follow-up)
- Magnetism on all nav links + hero scroll cue (quick follow-up)
- Hover sound on every interactive element (could add via the hook itself — opted not to to avoid noise pollution)

**Risk / open items:**
- The `AudioContext` is created on module load when `getContext()` is first called (inside `tone()`). Some browsers (Safari mobile) require `audioContext.resume()` after a user gesture. `tone()` calls `resume()` defensively, but the first `playClick` after toggling sound on may be the actual gesture that unlocks audio.
- Magnetism uses `useMotionValue` + `useSpring`. These do NOT cause React re-renders, so it's free perf-wise. However, the mousemove listener is attached per-element, which is fine for our ~3 elements but doesn't scale to dozens.
- `useReducedMotion` runs once on mount via `useEffect`. If the user toggles reduce-motion in OS settings while the page is open, the magnetism stays on until reload. Acceptable.

**YAGNI check:**
- No "hover sound on every element" — would be noise pollution. Click sound on CTAs is the right balance.
- No global magnetism context — props-drilling the magnetism is one line per element, simpler than abstracting.
- No sound asset preloading — synth only, no assets to preload.
