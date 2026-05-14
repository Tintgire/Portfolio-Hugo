import { useEffect, useRef } from 'react'
import { subscribeMouse, getMouseX, getMouseY } from '../../lib/mouseTracker'

const PALETTE = [
  [145, 94, 255],   // #915EFF
  [192, 132, 252],  // #c084fc
  [236, 72, 153],   // #ec4899
]
// Pre-built fillStyle strings (no per-frame alloc); per-particle alpha is
// applied via globalAlpha.
const PALETTE_STR = PALETTE.map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`)

const FONT_STACK = '"JetBrains Mono", "Menlo", "Consolas", monospace'

// Sample the silhouette of an arbitrary text string rendered via the
// codebase's monospace font stack. Two paths:
//   - "{ }"  → render `{` and `}` as two separate fillText calls at
//     calibrated positions (w*0.36 and w*0.64). The single-string approach
//     can't fit at the chosen ratio because monospace `{ }` occupies 3 cells.
//   - any other text → single centered fillText with auto-fit: starts at
//     0.78×h, scales the font down if measureText reports the string
//     wider than 85% of the canvas. Keeps a few px of side padding.
function sampleShapeOffsets(w, h, shape) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  if (shape === '{ }') {
    const size = Math.floor(h * 0.78)
    ctx.font = `900 ${size}px ${FONT_STACK}`
    ctx.fillText('{', w * 0.36, h / 2)
    ctx.fillText('}', w * 0.64, h / 2)
  } else {
    let size = Math.floor(h * 0.78)
    ctx.font = `900 ${size}px ${FONT_STACK}`
    const maxW = w * 0.85
    const measured = ctx.measureText(shape).width
    if (measured > maxW) {
      size = Math.floor(size * (maxW / measured))
      ctx.font = `900 ${size}px ${FONT_STACK}`
    }
    ctx.fillText(shape, w / 2, h / 2)
  }

  const data = ctx.getImageData(0, 0, w, h).data
  const offsets = []
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > 180) {
        offsets.push([x - w / 2, y - h / 2])
      }
    }
  }
  return offsets
}

export default function ParticleShapeField2D({ count = 900, shape = '{ }', side = 'right' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = canvas.clientWidth
    let h = canvas.clientHeight
    // Particle data stored in flat typed-array-friendly buckets per palette
    // color. Bucket-by-color avoids per-particle fillStyle changes (fillStyle
    // setter parses CSS colors, which is hot-path-expensive). Per-particle
    // alpha is applied via ctx.globalAlpha on each fillRect.
    const buckets = PALETTE.map(() => ({
      ox: [], oy: [], tx: [], ty: [], seed: [], size: [],
    }))
    let shapeW = 240
    let shapeH = 240
    let offsets = sampleShapeOffsets(shapeW, shapeH, shape)

    const initParticles = () => {
      for (const b of buckets) { b.ox.length = 0; b.oy.length = 0; b.tx.length = 0; b.ty.length = 0; b.seed.length = 0; b.size.length = 0 }
      const N = offsets.length
      for (let i = 0; i < count; i++) {
        // Stride sampling so all parts of the silhouette get particles even
        // when count < N (offsets are top-to-bottom; naive `i % N` would
        // only cover the top of the shape).
        const idx = N > 0 ? Math.floor((i / count) * N) % N : 0
        const o = N > 0 ? offsets[idx] : [0, 0]
        const colorIdx = Math.floor(Math.random() * PALETTE.length)
        const b = buckets[colorIdx]
        b.ox.push(Math.random() * w)
        b.oy.push(Math.random() * h)
        b.tx.push(o[0])
        b.ty.push(o[1])
        b.seed.push(Math.random())
        b.size.push(0.9 + Math.random() * 0.6)
      }
    }

    const sizeCanvas = () => {
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      if (cssW === 0 || cssH === 0) return false
      // Hard-cap DPR at 1 — particles look fine at native resolution and
      // 7 simultaneous canvases at DPR=2 quadruple the per-frame pixel
      // work for no real visual gain.
      canvas.width = cssW
      canvas.height = cssH
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      w = cssW
      h = cssH
      // Sample canvas dims for the brace/text silhouette (separate from the
      // render canvas size; just controls the resolution of the offsets).
      shapeW = Math.min(360, w * 0.8)
      shapeH = Math.min(320, h * 0.7)
      offsets = sampleShapeOffsets(shapeW, shapeH, shape)
      initParticles()
      return true
    }

    if (!sizeCanvas()) {
      const ro = new ResizeObserver(() => {
        if (sizeCanvas()) ro.disconnect()
      })
      ro.observe(canvas)
    }

    // Smoothed shape center — what the particles target. Lerped each frame
    // toward the clamped cursor so the shape glides instead of snapping.
    let shapeCenterX = -9999
    let shapeCenterY = -9999
    let hoverTarget = 0
    let hover = 0
    let raf = 0
    let visible = true
    const start = performance.now()

    // Cached canvas bounding rect — mouse-position math only needs the rect
    // to map clientX/Y into local canvas coords. Recompute lazily on scroll
    // and resize instead of on every mousemove (which was happening 7×
    // before this refactor — one lookup per ParticleShapeField2D instance).
    let cachedRect = canvas.getBoundingClientRect()
    const refreshRect = () => { cachedRect = canvas.getBoundingClientRect() }

    // Subscribe to the shared mouse tracker (one window-level listener
    // shared across all instances) instead of installing our own.
    const unsubscribeMouse = subscribeMouse()

    // Shape confinement zone: the empty viewport-half OPPOSITE the card.
    const getBox = () => side === 'left'
      ? { xMin: w * 0.17, xMax: w * 0.33, yMin: h * 0.35, yMax: h * 0.65 }
      : { xMin: w * 0.67, xMax: w * 0.83, yMin: h * 0.35, yMax: h * 0.65 }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) {
        // Refresh the cached rect on (re)entry — its position likely changed
        // since we last saw it.
        refreshRect()
        if (!raf) tick()
      }
    })
    io.observe(canvas)

    const tick = () => {
      if (!visible) {
        raf = 0
        return
      }
      // Compute mouse position relative to the cached rect (no
      // getBoundingClientRect here).
      const mx = getMouseX() - cachedRect.left
      const my = getMouseY() - cachedRect.top
      hoverTarget = (mx >= 0 && mx <= cachedRect.width && my >= 0 && my <= cachedRect.height) ? 1 : 0

      hover += (hoverTarget - hover) * 0.07
      const t = reduced ? 0 : (performance.now() - start) / 1000

      ctx.clearRect(0, 0, w, h)

      // Smooth the shape center: clamp mouse into the active box, then lerp.
      const b = getBox()
      const targetX = Math.max(b.xMin, Math.min(b.xMax, mx))
      const targetY = Math.max(b.yMin, Math.min(b.yMax, my))
      if (shapeCenterX === -9999) {
        shapeCenterX = (b.xMin + b.xMax) / 2
        shapeCenterY = (b.yMin + b.yMax) / 2
      }
      shapeCenterX += (targetX - shapeCenterX) * 0.12
      shapeCenterY += (targetY - shapeCenterY) * 0.12

      const wobbleAmp = 1.4 * (1 - hover * 0.6)
      const sizeBoost = 1.6 + hover * 0.6

      // Iterate per color bucket. Setting fillStyle once per bucket avoids
      // ~`count` CSS-color-string allocations + parses per frame.
      for (let bi = 0; bi < buckets.length; bi++) {
        const bk = buckets[bi]
        ctx.fillStyle = PALETTE_STR[bi]
        const oxArr = bk.ox, oyArr = bk.oy, txArr = bk.tx, tyArr = bk.ty
        const seedArr = bk.seed, sizeArr = bk.size
        const len = oxArr.length
        for (let i = 0; i < len; i++) {
          const seed = seedArr[i]
          const wx = oxArr[i] + Math.sin(t * 0.6 + seed * 12.5) * wobbleAmp
          const wy = oyArr[i] + Math.cos(t * 0.5 + seed * 8.3) * wobbleAmp
          const tx = shapeCenterX + txArr[i]
          const ty = shapeCenterY + tyArr[i]
          const x = wx + (tx - wx) * hover
          const y = wy + (ty - wy) * hover
          const scintil = 0.6 + 0.4 * Math.sin(t * 2.4 + seed * 30)
          ctx.globalAlpha = (0.55 + 0.45 * scintil) * 0.95
          const sz = sizeBoost * scintil * sizeArr[i]
          ctx.fillRect(x, y, sz, sz)
        }
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => {
      sizeCanvas()
      refreshRect()
    }
    // Passive scroll listener to keep cachedRect in sync without forcing
    // synchronous layout on every scroll event.
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', refreshRect, { passive: true })

    return () => {
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', refreshRect)
      unsubscribeMouse()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [count, shape, side])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
