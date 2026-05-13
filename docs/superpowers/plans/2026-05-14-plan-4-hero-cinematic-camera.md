# Plan 4 — Hero Cinematic Camera

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fixed-camera + `<OrbitControls>` setup in the Hero `ComputersCanvas` with a cinematic camera that (a) gently sways at idle for a "breathing" feel, and (b) pulls back + rises as the user scrolls through the hero section. The user loses the manual drag-to-rotate interaction — that's an explicit trade-off for the cinematic effect.

**Architecture:**
- New `CinematicCamera.jsx` component that mounts a Drei `<PerspectiveCamera makeDefault>` and drives its position frame-by-frame via `useFrame`.
- Idle sway: small `sin` / `cos` offsets on x/y based on `state.clock.elapsedTime`, scaled to ~0.5 units max.
- Scroll-driven pull-back: read `window.scrollY` directly inside `useFrame` (zero re-renders). Normalized to a 0→1 progress over `window.innerHeight * 0.6` (matches the fade-out range from Plan 2 so the camera completes its motion before the canvas disappears).
- Camera path: starts at `[20, 3, 5]`, ends at `[12, 6, 12]` over the scroll progress. `lookAt(0, -1, 0)` so the PC stays centered.
- `ComputersCanvas` removes `<OrbitControls>` and the `camera={{...}}` prop on `<Canvas>`, mounting `<CinematicCamera />` inside instead.

**Tech Stack:**
- Existing: `@react-three/fiber` (`useFrame`), `@react-three/drei` (`PerspectiveCamera`)
- No new deps
- Lenis (Plan 1) already updates `window.scrollY` natively, so reading it inside `useFrame` reflects the smooth-scroll position correctly

**Reference spec:** docs/superpowers/specs/2026-05-13-portfolio-cinematic-redesign-design.md §4 (Pillar 1 — Scénographie cinématique)

---

### Task 1: Create CinematicCamera component

**Files:** Create `src/components/canvas/CinematicCamera.jsx`

A self-contained Drei `<PerspectiveCamera>` whose position is updated each frame from clock + scroll.

- [ ] **Step 1: Write the component**

Create `src/components/canvas/CinematicCamera.jsx`:

```jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'

const START = { x: 20, y: 3, z: 5 }
const END = { x: 12, y: 6, z: 12 }
const SWAY_AMP_X = 0.5
const SWAY_AMP_Y = 0.3
const SWAY_FREQ_X = 0.4
const SWAY_FREQ_Y = 0.3

function lerp(a, b, t) {
  return a + (b - a) * t
}

function clamp01(v) {
  return Math.min(1, Math.max(0, v))
}

export default function CinematicCamera() {
  const ref = useRef(null)

  useFrame((state) => {
    const camera = ref.current
    if (!camera) return

    const vh = window.innerHeight || 800
    const scrollT = clamp01(window.scrollY / (vh * 0.6))

    const t = state.clock.elapsedTime
    const swayX = Math.sin(t * SWAY_FREQ_X) * SWAY_AMP_X
    const swayY = Math.cos(t * SWAY_FREQ_Y) * SWAY_AMP_Y
    // Sway fades out as scroll progresses so the pull-back motion takes over cleanly
    const swayMix = 1 - scrollT

    camera.position.x = lerp(START.x, END.x, scrollT) + swayX * swayMix
    camera.position.y = lerp(START.y, END.y, scrollT) + swayY * swayMix
    camera.position.z = lerp(START.z, END.z, scrollT)
    camera.lookAt(0, -1, 0)
  })

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      fov={25}
      position={[START.x, START.y, START.z]}
    />
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npx vite build
```

Expected: success. `PerspectiveCamera` is already an exported binding from `@react-three/drei` (the project's drei 9.80.1 supports it).

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/components/canvas/CinematicCamera.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: add CinematicCamera with idle sway + scroll-driven pull-back"
```

---

### Task 2: Wire CinematicCamera into ComputersCanvas

**Files:** Modify `src/components/canvas/Computers.jsx`

Remove `<OrbitControls>` and the inline `camera={{...}}` prop on `<Canvas>`. Mount `<CinematicCamera />` inside the Suspense block instead.

- [ ] **Step 1: Replace the file**

Open `src/components/canvas/Computers.jsx`. Replace the ENTIRE content with:

```jsx
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, useGLTF } from '@react-three/drei'

import CanvasLoader from '../Loader'
import { useIsMobile } from '../../lib/hooks/useIsMobile'
import HeroParticles from './HeroParticles'
import CinematicCamera from './CinematicCamera'

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
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <CinematicCamera />
        <Computers isMobile={isMobile} />
        <HeroParticles count={isMobile ? 400 : 800} />
      </Suspense>

      <Preload all />
    </Canvas>
  )
}

export default ComputersCanvas
```

Key differences from the previous version:
- Removed `OrbitControls` import (no longer needed)
- Removed `camera={{ position: [20, 3, 5], fov: 25 }}` prop from `<Canvas>` (now owned by `<CinematicCamera>`)
- Removed the `<OrbitControls ... />` block from inside Suspense
- Added `<CinematicCamera />` as the FIRST child of Suspense (must be before any mesh so `makeDefault` registers the camera)
- Added `import CinematicCamera from './CinematicCamera'`

- [ ] **Step 2: Verify build**

```bash
npx vite build
```

Expected: success.

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/components/canvas/Computers.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: replace OrbitControls with CinematicCamera in hero canvas"
```

---

### Task 3: Visual verification locally (controller)

This task is performed by the controller, not the implementer.

Start the dev server (preview tool, name `vite-dev`). At `http://localhost:5173`:

1. **Idle sway** — without scrolling, the camera should subtly sway. The PC should appear to gently float left/right and up/down by ~0.5 units over a few seconds.
2. **Scroll pull-back** — scroll slowly. The PC should appear to recede and the angle should shift slightly upward as the camera rises. By the time `scrollY ≈ 0.6 × viewport height`, the canvas is fully faded (Plan 2 carry-over) and the camera motion has completed.
3. **No drag to rotate** — clicking and dragging the PC area should do nothing (OrbitControls removed). Pointer events pass through to the underlying DOM (typing animation should still receive cursor events on its area).
4. **No console errors**.
5. **Mobile (375×812)** — verify the same behavior. PC is smaller (`isMobile` scale = 0.6) but the camera motion still applies.

If anything is off (e.g., camera ends up looking at the wrong spot, sway too strong), the parameters at the top of `CinematicCamera.jsx` (`START`, `END`, `SWAY_AMP_X`, `SWAY_AMP_Y`, `SWAY_FREQ_X`, `SWAY_FREQ_Y`) are the dials to tune.

---

### Task 4: Deploy and verify production

- [ ] **Step 1: Push**

```bash
git push origin main
```

- [ ] **Step 2: Wait for Vercel deploy**

```bash
sleep 90 && curl -o /dev/null -s -w "Home: %{http_code}\n" https://portfolio-hugo-ten.vercel.app/
```

Expected: `Home: 200`.

- [ ] **Step 3: Visual check on production**

Open https://portfolio-hugo-ten.vercel.app/. Confirm idle sway + scroll pull-back work the same as in local verification (Task 3). Carry-over regression checks:
- Lenis smooth scroll still works (Plan 1)
- Rubi featured card + drawer still works (Plans 1 + 3)
- HeroParticles still visible (Plan 2)
- Canvas fade-out as you scroll past hero (Plan 2)

- [ ] **Step 4: No commit needed**

Plan 4 complete once production is verified.

---

## Self-Review Notes

**Spec coverage:**
- Spec §4.3 (Camera keyframes — Act I) — partially covered. Plan 4 implements only Act I (Hero) camera keyframes. Acts II-V remain on their own per-section canvases for now.
- Spec §4.4 (Spectacular dissolve Act I→II) — NOT covered. That requires the dissolve effect at the section boundary and is left for a later plan.

**Not covered (deferred):**
- Camera motion in About / Tech / Contact sections (each still uses its own canvas with static or auto-rotate camera)
- The "dissolve" effect when transitioning between sections
- Earth pull-back in Act V
- Sound design + magnetism (Plan 6)

**Risk / open items:**
- Reading `window.scrollY` directly inside `useFrame` is fast and avoids re-renders, but means the camera reacts to the raw scroll position. With Lenis, the scroll is smooth, so the camera motion will feel smooth too. If we ever wanted "snap-to-act" behavior, we'd need a different driver.
- `frameloop="always"` is still in place (Plan 2 carry-over). The reviewer flagged this in Plan 2 final review as a perf concern. This plan doesn't make it worse, but doesn't fix it either. A future task could gate `frameloop` on hero visibility (IntersectionObserver) — small win, not blocking.
- The PC GLTF model is positioned at `[0, -3.25, -1.5]` (desktop). The `lookAt(0, -1, 0)` target picks a Y of -1 which is slightly above the PC's center. If the camera framing feels off, adjust the lookAt Y or the END position.

**YAGNI check:**
- No FOV animation (decided against — position motion alone is enough).
- No "scroll velocity" smoothing (Lenis already smooths it).
- No `useReducedMotion` guard yet — could disable sway when user prefers reduced motion. Defer to a follow-up if accessibility audit flags it.
