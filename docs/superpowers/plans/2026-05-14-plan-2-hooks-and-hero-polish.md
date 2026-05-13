# Plan 2 — Foundation Hooks + Hero Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3 foundation hooks that future plans will lean on (`useReducedMotion`, `useIsMobile`, `useScrollProgress`), and polish the Hero section with cosmic particles around the PC and a scroll-driven fade-out. No canvas refactor — the existing per-section Canvas architecture is kept; the cinematic camera flow will be addressed at Act-level later.

**Architecture:**
- A new `src/lib/hooks/` directory holds the 3 hooks. Each hook is a single-purpose, SSR-safe utility that observes a browser concern (motion preference, viewport width, scroll position).
- `Computers.jsx` is refactored to use `useIsMobile()` instead of the inline media-query effect — removes duplication, paves the way for other components.
- A new `HeroParticles` component is added INSIDE the existing `ComputersCanvas` scene. It's a `<Points>` cloud of ~800 violet particles rotating slowly around the PC.
- `Hero.jsx` wraps its `<ComputersCanvas>` in a `motion.div` whose opacity is driven by `useScroll()` + `useTransform()` from framer-motion. The PC fades out as the user scrolls past the hero.

**Tech Stack:**
- Existing: React 18, Framer Motion (`useScroll`, `useTransform`, `useReducedMotion` upstream), R3F, @react-three/drei (`Points`, `PointMaterial`), `maath` (already used by `Stars.jsx` for sphere sampling)
- No new deps

**Reference spec:** `docs/superpowers/specs/2026-05-13-portfolio-cinematic-redesign-design.md`

---

### Task 1: Create useReducedMotion hook

**Files:**
- Create: `src/lib/hooks/useReducedMotion.js`

A thin SSR-safe wrapper around the `prefers-reduced-motion` media query. We define our own (not re-export framer-motion's) so non-Framer components can use it too without pulling motion.

- [ ] **Step 1: Write the hook**

Create `src/lib/hooks/useReducedMotion.js` with:

```js
import { useEffect, useState } from 'react'

/**
 * Returns true when the user has requested reduced motion via OS settings.
 * SSR-safe (returns false on the server, then matches the actual preference after mount).
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
```

- [ ] **Step 2: Verify build still works**

```bash
npx vite build
```

Expected: build succeeds. The file isn't imported anywhere yet, so this is purely a lint/parse check.

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/lib/hooks/useReducedMotion.js
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: add useReducedMotion hook"
```

---

### Task 2: Create useIsMobile hook + refactor Computers to use it

**Files:**
- Create: `src/lib/hooks/useIsMobile.js`
- Modify: `src/components/canvas/Computers.jsx`

The existing `ComputersCanvas` has an inline mobile-detection effect with `(max-width: 500px)`. We extract a reusable hook with a configurable breakpoint, defaulting to **500px** to preserve current behavior.

- [ ] **Step 1: Write the hook**

Create `src/lib/hooks/useIsMobile.js`:

```js
import { useEffect, useState } from 'react'

/**
 * Returns true when the viewport width is below `maxWidth`.
 * Re-evaluates on viewport resize. SSR-safe.
 */
export function useIsMobile(maxWidth = 500) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth - 1}px)`)
    setIsMobile(mq.matches)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [maxWidth])

  return isMobile
}
```

- [ ] **Step 2: Refactor Computers.jsx**

Open `src/components/canvas/Computers.jsx`. Replace the entire content with:

```jsx
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload, useGLTF } from '@react-three/drei'

import CanvasLoader from '../Loader'
import { useIsMobile } from '../../lib/hooks/useIsMobile'

const Computers = ({ isMobile }) => {
  const computer = useGLTF('./desktop_pc/scene.gltf')

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.6 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  )
}

const ComputersCanvas = () => {
  const isMobile = useIsMobile(500)

  return (
    <Canvas
      frameloop="demand"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  )
}

export default ComputersCanvas
```

The only logical change: the inline `useState`/`useEffect`/`matchMedia` block is gone, replaced with `const isMobile = useIsMobile(500)`. The visible behavior must be identical.

- [ ] **Step 3: Verify build**

```bash
npx vite build
```

Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/lib/hooks/useIsMobile.js src/components/canvas/Computers.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: extract useIsMobile hook and use it in Computers"
```

---

### Task 3: Create useScrollProgress hooks (page + element)

**Files:**
- Create: `src/lib/hooks/useScrollProgress.js`

Two related hooks. `usePageScrollProgress()` returns 0→1 progress through the entire page. `useElementScrollProgress(ref)` returns 0→1 progress as a specific element travels through the viewport (0 when its top crosses the viewport bottom, 1 when its bottom crosses the viewport top).

Both rely on `window.scrollY`, which Lenis updates natively, so no Lenis coupling is needed.

- [ ] **Step 1: Write the hooks**

Create `src/lib/hooks/useScrollProgress.js`:

```js
import { useEffect, useState } from 'react'

/**
 * Page scroll progress, 0 at top, 1 at bottom.
 */
export function usePageScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const compute = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute, { passive: true })
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])

  return progress
}

/**
 * Progress 0→1 of an element traversing the viewport.
 * 0 just before its top enters from below.
 * 1 just after its bottom exits at the top.
 */
export function useElementScrollProgress(ref) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const compute = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height + vh
      const passed = vh - rect.top
      setProgress(Math.min(1, Math.max(0, passed / total)))
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute, { passive: true })
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [ref])

  return progress
}
```

- [ ] **Step 2: Verify build**

```bash
npx vite build
```

Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/lib/hooks/useScrollProgress.js
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: add useScrollProgress hooks (page + element)"
```

---

### Task 4: Add HeroParticles component to the ComputersCanvas

**Files:**
- Create: `src/components/canvas/HeroParticles.jsx`
- Modify: `src/components/canvas/Computers.jsx`

A `<Points>` cloud of ~800 violet particles rotating slowly inside the ComputersCanvas. Uses `maath/random` (already a dependency, used by `Stars.jsx`) for sphere sampling.

- [ ] **Step 1: Write the HeroParticles component**

Create `src/components/canvas/HeroParticles.jsx`:

```jsx
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'

export default function HeroParticles({ count = 800 }) {
  const ref = useRef()
  const positions = useMemo(
    () => random.inSphere(new Float32Array(count * 3), { radius: 6 }),
    [count]
  )

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta / 30
    ref.current.rotation.x += delta / 60
  })

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#915EFF"
          size={0.018}
          sizeAttenuation
          depthWrite={false}
          opacity={0.7}
        />
      </Points>
    </group>
  )
}
```

- [ ] **Step 2: Mount HeroParticles inside the ComputersCanvas**

Open `src/components/canvas/Computers.jsx`. Modify the `ComputersCanvas` component to import and render `HeroParticles` alongside `<Computers />` inside the `<Suspense>` block.

Replace the file with:

```jsx
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload, useGLTF } from '@react-three/drei'

import CanvasLoader from '../Loader'
import { useIsMobile } from '../../lib/hooks/useIsMobile'
import HeroParticles from './HeroParticles'

const Computers = ({ isMobile }) => {
  const computer = useGLTF('./desktop_pc/scene.gltf')

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.6 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  )
}

const ComputersCanvas = () => {
  const isMobile = useIsMobile(500)

  return (
    <Canvas
      frameloop="always"
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Computers isMobile={isMobile} />
        <HeroParticles count={isMobile ? 400 : 800} />
      </Suspense>

      <Preload all />
    </Canvas>
  )
}

export default ComputersCanvas
```

Two important changes from the previous version:
1. `frameloop="demand"` → `frameloop="always"`. The particles need a continuous render loop to animate; `demand` only renders on prop changes.
2. `<HeroParticles count={isMobile ? 400 : 800} />` is mounted inside the Suspense block. Half count on mobile for perf.

- [ ] **Step 3: Verify build**

```bash
npx vite build
```

Expected: succeeds. Bundle size will tick up slightly (Points/PointMaterial likely already imported by Stars).

- [ ] **Step 4: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/components/canvas/HeroParticles.jsx src/components/canvas/Computers.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: add HeroParticles cloud around the PC in hero canvas"
```

---

### Task 5: Add scroll-driven fade-out to Hero canvas

**Files:**
- Modify: `src/components/Hero.jsx`

The `<ComputersCanvas />` is wrapped in a `motion.div` whose opacity is driven by scroll progress. Fades from 1 → 0 as the user scrolls past 60% of the viewport height.

- [ ] **Step 1: Modify Hero.jsx**

Open `src/components/Hero.jsx`. At the top, add the framer-motion imports for `useScroll` and `useTransform`:

```jsx
import { motion, useScroll, useTransform } from 'framer-motion'
```

(The file already imports `motion`. Adding `useScroll` and `useTransform` to the existing import.)

Inside the `Hero` component, after the existing useState/useEffect setup, add:

```jsx
const { scrollY } = useScroll()
const canvasOpacity = useTransform(scrollY, [0, typeof window !== 'undefined' ? window.innerHeight * 0.6 : 600], [1, 0])
```

Then replace the bare `<ComputersCanvas />` JSX with a `motion.div` wrapper:

```jsx
<motion.div className="absolute inset-0" style={{ opacity: canvasOpacity }}>
  <ComputersCanvas />
</motion.div>
```

The exact replacement: locate `<ComputersCanvas />` (currently around line 90 of Hero.jsx) and replace that single line with the motion.div block above. The motion.div takes `absolute inset-0` so it overlays the section the same way the canvas was overlaying before.

If the current ComputersCanvas does NOT already have a wrapping div with absolute positioning (it just sits as a direct child of the section), make sure the new motion.div fills the same area. The section is `relative w-80vw h-screen mx-auto overflow-hidden`, so `absolute inset-0` on the motion.div fills it.

- [ ] **Step 2: Verify build**

```bash
npx vite build
```

Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/components/Hero.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: fade hero canvas out as user scrolls past viewport"
```

---

### Task 6: Deploy and verify production

**Files:** none

- [ ] **Step 1: Push**

```bash
git push origin main
```

- [ ] **Step 2: Wait for Vercel deploy (~90s)**

```bash
sleep 90 && curl -o /dev/null -s -w "Home: %{http_code}\n" https://portfolio-hugo-ten.vercel.app/
```

Expected: `Home: 200`.

- [ ] **Step 3: Visual verification on production**

Open https://portfolio-hugo-ten.vercel.app/ in a browser.

Confirm:
- Hero PC has subtle violet particles drifting around it (more visible against the dark background)
- Scrolling slowly down: the PC + particles fade out by the time the About section is in view
- No console errors
- Lenis smooth scroll still works (carry-over from Plan 1)
- Rubi featured card still displays (carry-over from Plan 1 — regression check)

If issues: rollback is `git revert HEAD~5..HEAD` (the 5 feature commits from this plan) or revert specific commits.

- [ ] **Step 4: No commit needed**

Plan 2 complete once verified.

---

## Self-Review Notes

**Spec coverage:** Plan 2 covers part of spec §4 (foundation hooks that Pillar 1 will lean on later) and adds Hero polish that gets the "cinematic feel" started without the full canvas refactor. The actual single-global-canvas refactor is deferred — likely absorbed into the cinematic scenography plan when the camera-flow scenes are designed.

**Not covered (deferred):**
- Single global canvas refactor (revisited later)
- Scroll-driven 3D scene morphing (Plans 4-5)
- Sound system + magnetism (Plan 6 still)
- Drawer detail view + 3D Works (Plan 3)

**Risk / open items:**
- `frameloop` switch from `demand` to `always` will slightly increase GPU usage in the Hero section. Acceptable for a hero section (visible briefly). Particles need it; static demand-driven render would freeze them.
- The opacity-driven fade only handles the visual layer. The Canvas is still mounted and rendering frames even at opacity 0. Future optimization: unmount or pause the canvas when fully faded (Plan 4 territory).
- `useScrollProgress` hooks use `setState` on every scroll event, which can be expensive if many components subscribe. Currently only Hero will use it (and via framer-motion's `useScroll` rather than the new hook). The new hook is plumbing for Plan 3+ consumers.

**YAGNI check:**
- 3 hooks added even though only `useIsMobile` is consumed immediately. Justification: spec mandates `prefers-reduced-motion` everywhere and Plan 3+ will need scroll progress for parallax. Better to land all 3 utilities now than write similar code 3 times in the next plans.
