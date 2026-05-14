import { useEffect, useRef } from 'react'

const PALETTE = [
  [145, 94, 255],   // #915EFF
  [192, 132, 252],  // #c084fc
  [236, 72, 153],   // #ec4899
]

function sampleShapeOffsets(text, w, h) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.font = `900 ${Math.floor(h * 0.95)}px "JetBrains Mono", "Menlo", "Consolas", monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('{', w * 0.3, h / 2 + h * 0.04)
  ctx.fillText('}', w * 0.7, h / 2 + h * 0.04)

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

export default function ParticleShapeField2D({ count = 1400 }) {
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
    let offsets = sampleShapeOffsets('{ }', shapeW, shapeH)

    const initParticles = () => {
      particles = []
      for (let i = 0; i < count; i++) {
        const o = offsets.length > 0 ? offsets[i % offsets.length] : [0, 0]
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
      // Re-shape the {} relative to canvas (smaller than canvas, scales with width)
      shapeW = Math.min(280, w * 0.7)
      shapeH = Math.min(260, h * 0.6)
      offsets = sampleShapeOffsets('{ }', shapeW, shapeH)
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
    let hoverTarget = 0
    let hover = 0
    let raf = 0
    let visible = true
    const start = performance.now()

    // Track mouse via window — the canvas itself is pointer-events: none so it
    // doesn't block clicks on cards above it. Hover ON when cursor is inside
    // the canvas's bounding box.
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouseX = e.clientX - r.left
      mouseY = e.clientY - r.top
      hoverTarget = (mouseX >= 0 && mouseX <= r.width && mouseY >= 0 && mouseY <= r.height) ? 1 : 0
    }
    const onLeaveDoc = () => { hoverTarget = 0 }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeaveDoc)

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

      const wobbleAmp = 1.4 * (1 - hover * 0.6)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        // origin + wobble
        const wx = p.ox + Math.sin(t * 0.6 + p.seed * 12.5) * wobbleAmp
        const wy = p.oy + Math.cos(t * 0.5 + p.seed * 8.3) * wobbleAmp
        // target = mouse + offset
        const tx = mouseX + p.tx
        const ty = mouseY + p.ty
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
      window.removeEventListener('mouseout', onLeaveDoc)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  )
}
