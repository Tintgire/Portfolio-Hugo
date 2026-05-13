# Plan 5 — Earth Atmospheric Polish

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Contact section's Earth canvas to feel more cinematic — add an atmospheric violet halo around the Earth (the iconic "planet with atmosphere from space" look) and a rim light that ties the planet to the rest of the cosmic theme. Keep the existing `autoRotate` behavior (it already works well).

**Architecture:**
- New `EarthGlow.jsx` component: a sphere mesh slightly larger than Earth, rendered with `side: THREE.BackSide` and a transparent violet material. This is the standard "atmosphere fresnel" technique: rendering the back-faces of an outer sphere creates a soft glow halo around the front-rendered Earth.
- Add a directional rim light (violet) coming from behind/side of the Earth for the "lit-from-space-edge" feel.
- The existing `<Earth />` primitive stays unchanged. `<OrbitControls autoRotate>` stays — no camera refactor.

**Tech Stack:**
- Existing: `@react-three/fiber` (already a Three.js wrapper), Three.js primitives (`sphereGeometry`, `meshBasicMaterial`, `BackSide`)
- No new deps

**Reference spec:** docs/superpowers/specs/2026-05-13-portfolio-cinematic-redesign-design.md §3 (Act V) and §4

---

### Task 1: Create EarthGlow component

**Files:** Create `src/components/canvas/EarthGlow.jsx`

A transparent sphere using `meshBasicMaterial` with `BackSide` rendering creates the atmosphere effect cheaply (no custom shader needed). Slightly larger than the Earth's 2.5 scale.

- [ ] **Step 1: Write the component**

Create `src/components/canvas/EarthGlow.jsx`:

```jsx
import { BackSide } from 'three'

/**
 * Atmospheric halo around the Earth — a back-rendered sphere slightly larger
 * than the planet, giving the iconic "atmosphere fresnel" look without a
 * custom shader.
 */
export default function EarthGlow({ color = '#915EFF', opacity = 0.18, scale = 2.85 }) {
  return (
    <mesh scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={BackSide}
        depthWrite={false}
      />
    </mesh>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npx vite build
```

Expected: success.

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/components/canvas/EarthGlow.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: add EarthGlow atmospheric halo component"
```

---

### Task 2: Add violet rim light + glow to EarthCanvas

**Files:** Modify `src/components/canvas/Earth.jsx`

Mount `<EarthGlow />` alongside `<Earth />` inside Suspense, and add a violet `<directionalLight>` from behind/side.

- [ ] **Step 1: Replace the file**

Replace the ENTIRE content of `src/components/canvas/Earth.jsx` with:

```jsx
import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

import CanvasLoader from '../Loader'
import EarthGlow from './EarthGlow'

const Earth = () => {
  const earth = useGLTF('./planet/scene.gltf')

  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  )
}

const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop="demand"
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={0.15} />
        <directionalLight position={[-8, 4, -6]} intensity={1.5} color="#915EFF" />
        <directionalLight position={[6, -2, 4]} intensity={0.4} color="#ff6ec7" />
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />
        <EarthGlow />
      </Suspense>
    </Canvas>
  )
}

export default EarthCanvas
```

Logical changes from the previous Earth.jsx:
- Added `import EarthGlow from './EarthGlow'`
- Added `<ambientLight intensity={0.15} />` (subtle base light so the dark side of Earth isn't pitch black)
- Added a violet `<directionalLight>` from upper-left-behind for the rim effect (`#915EFF`, intensity 1.5)
- Added a pink fill `<directionalLight>` from lower-right (`#ff6ec7`, intensity 0.4) for subtle bounce
- Added `<EarthGlow />` inside Suspense after `<Earth />`

Note: `frameloop="demand"` is preserved — the atmosphere is static, so no need to switch to "always".

- [ ] **Step 2: Verify build**

```bash
npx vite build
```

Expected: success.

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/components/canvas/Earth.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: add atmospheric glow + violet rim lighting to Earth scene"
```

---

### Task 3: Visual verification locally (controller)

The controller verifies. Start dev server (`vite-dev`), scroll to the Contact section.

Confirm:
- Earth has a soft violet halo around it (the atmosphere)
- The lit side of Earth has a violet tint (rim light)
- Auto-rotation still works
- No console errors
- Mobile (375px): same effect visible

---

### Task 4: Deploy and verify production

- [ ] **Step 1: Push**

```bash
git push origin main
```

- [ ] **Step 2: Wait for Vercel deploy + verify**

```bash
sleep 90 && curl -o /dev/null -s -w "Home: %{http_code}\n" https://portfolio-hugo-ten.vercel.app/
```

Expected: 200.

- [ ] **Step 3: Visual check on production**

Carry-over regressions to also verify:
- Hero cinematic camera + sway + fade (Plans 2 + 4)
- Lenis smooth scroll (Plan 1)
- Rubi drawer (Plan 3)

---

## Self-Review Notes

**Spec coverage:**
- §3 (Act V Earth pull-back) — partially. The "pull-back massive camera motion" is NOT implemented; we keep autoRotate. The atmospheric polish gives a clear visual upgrade without the bigger camera refactor.
- §4 (Pillar 1 scenography) — minor contribution. The atmosphere effect is the kind of polish that ties the cosmic theme together.

**Not covered (deferred):**
- Earth camera scroll-driven motion (could be added in a follow-up)
- Trust section consolidation (Feedbacks + Diplôme merge — bigger structural change)
- Sound design + magnetism (Plan 6)

**Risk / open items:**
- `BackSide` rendering at scale 2.85 around a scale 2.5 Earth means the glow extends ~0.35 units outward in world space. If the camera ever gets close to the Earth, the glow might fill the viewport. With current camera at `[-4, 3, 6]`, this is well outside the glow's bounds. Safe.
- `meshBasicMaterial` is unaffected by lights (that's intentional — the glow is a uniform color, not actual scattered light). If we later want a fresnel falloff that responds to view angle, we'd need a custom shader or `meshPhysicalMaterial` with transmission. Out of scope.
- `frameloop="demand"` preserved. The atmosphere is static and the OrbitControls autoRotate already triggers re-renders, so demand mode is correct. No perf regression vs Plan 4 Hero (which is `always`).

**YAGNI check:**
- No animated glow (no pulsing). Static halo is the cinematic look; pulsing would feel toy-like.
- No second outer-shell glow. One halo is enough.
- No directional lighting on the glow itself (it's `meshBasicMaterial`).
