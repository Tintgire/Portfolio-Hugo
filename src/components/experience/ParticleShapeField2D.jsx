import { useEffect, useRef } from 'react'

const PALETTE = [
  [145, 94, 255],   // #915EFF
  [192, 132, 252],  // #c084fc
  [236, 72, 153],   // #ec4899
]

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

export default function ParticleShapeField2D({ count = 1400, shape = '{ }', side = 'right' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = canvas.clientWidth
    let h = canvas.clientHeight
    let particles = []
    let shapeW = 240
    let shapeH = 240
    let offsets = sampleShapeOffsets(shapeW, shapeH, shape)

    const initParticles = () => {
      particles = []
      const N = offsets.length
      for (let i = 0; i < count; i++) {
        // Distribute particles UNIFORMLY across the offsets array. The
        // offsets are sampled top-to-bottom, so naive `i % N` (when count <
        // N, which is the common case: count=1400 vs N≈3700 for {}) would
        // assign all particles to the top half of the shape and leave the
        // bottom half empty. Stride-sampling ensures every part of the {}
        // gets particles.
        const idx = N > 0 ? Math.floor((i / count) * N) % N : 0
        const o = N > 0 ? offsets[idx] : [0, 0]
        const c = PALETTE[Math.floor(Math.random() * PALETTE.length)]
        particles.push({
          ox: Math.random() * w,           // origin
          oy: Math.random() * h,
          tx: o[0],                        // shape offset (relative to mouse)
          ty: o[1],
          color: c,
          seed: Math.random(),
          size: 0.9 + Math.random() * 0.6,
        })
      }
    }

    const sizeCanvas = () => {
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      if (cssW === 0 || cssH === 0) return false
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = cssW * dpr
      canvas.height = cssH * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      w = cssW
      h = cssH
      // Re-shape the {} relative to canvas. Larger sample canvas (was
      // 280×260) so the full braces fit at a generous font ratio without any
      // edge clipping. Width must comfortably fit two braces side-by-side.
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

    let mouseX = -9999
    let mouseY = -9999
    // Smoothed shape center — what the particles actually target. Lerped each
    // frame toward the clamped cursor so the {} glides instead of snapping.
    let shapeCenterX = -9999
    let shapeCenterY = -9999
    let hoverTarget = 0
    let hover = 0
    let raf = 0
    let visible = true
    const start = performance.now()

    // Shape confinement zone: the empty viewport-half OPPOSITE the card.
    // For odd-indexed timeline rows the card is on the right and the
    // particles render on the LEFT (centered around 25% of viewport
    // width); for even-indexed rows the card is on the left, particles
    // on the RIGHT (centered around 75%). Both modes share the same
    // tight 16% horizontal span and centered 30% vertical band.
    const getBox = () => side === 'left'
      ? { xMin: w * 0.17, xMax: w * 0.33, yMin: h * 0.35, yMax: h * 0.65 }
      : { xMin: w * 0.67, xMax: w * 0.83, yMin: h * 0.35, yMax: h * 0.65 }

    // Track mouse via window — the canvas itself is pointer-events: none so it
    // doesn't block clicks on cards above it. Hover ON anywhere on the canvas.
    // NOTE: do not also listen to `mouseout` — it bubbles up from every text
    // node and element transition, which would constantly reset hoverTarget
    // to 0 between mousemove ticks. The result was hover converging to ~0.5
    // (a half-formed {} shape). onMove alone fully tracks enter/leave because
    // it re-evaluates the bounds check each move.
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouseX = e.clientX - r.left
      mouseY = e.clientY - r.top
      hoverTarget = (mouseX >= 0 && mouseX <= r.width && mouseY >= 0 && mouseY <= r.height) ? 1 : 0
    }
    window.addEventListener('mousemove', onMove)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) tick()
    })
    io.observe(canvas)

    const tick = () => {
      if (!visible) {
        raf = 0
        return
      }
      hover += (hoverTarget - hover) * 0.07
      const t = reduced ? 0 : (performance.now() - start) / 1000

      ctx.clearRect(0, 0, w, h)

      // Smooth the shape center: clamp mouse into the active box, then lerp.
      // Even fast cursor jumps produce a gentle glide, and the {} can't
      // wander outside the right-hand zone.
      const b = getBox()
      const targetX = Math.max(b.xMin, Math.min(b.xMax, mouseX))
      const targetY = Math.max(b.yMin, Math.min(b.yMax, mouseY))
      if (shapeCenterX === -9999) {
        // First frame after init: snap to box center to avoid a fly-in
        shapeCenterX = (b.xMin + b.xMax) / 2
        shapeCenterY = (b.yMin + b.yMax) / 2
      }
      shapeCenterX += (targetX - shapeCenterX) * 0.12
      shapeCenterY += (targetY - shapeCenterY) * 0.12

      const wobbleAmp = 1.4 * (1 - hover * 0.6)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        // origin + wobble
        const wx = p.ox + Math.sin(t * 0.6 + p.seed * 12.5) * wobbleAmp
        const wy = p.oy + Math.cos(t * 0.5 + p.seed * 8.3) * wobbleAmp
        // target = smoothed shape center + per-particle offset within the {}
        const tx = shapeCenterX + p.tx
        const ty = shapeCenterY + p.ty
        // lerp
        const x = wx + (tx - wx) * hover
        const y = wy + (ty - wy) * hover
        // scintillate
        const scintil = 0.6 + 0.4 * Math.sin(t * 2.4 + p.seed * 30)
        const a = (0.55 + 0.45 * scintil) * 0.95
        const sz = (1.6 + hover * 0.6) * scintil * p.size
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${a})`
        ctx.fillRect(x, y, sz, sz)
      }

      raf = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => {
      sizeCanvas()
    }
    window.addEventListener('resize', onResize)

    return () => {
      io.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
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
