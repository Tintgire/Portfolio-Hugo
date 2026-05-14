import { useEffect, useRef } from 'react'

const PALETTE = [
  // r, g, b — violet primary + pink accent
  [145, 94, 255],
  [236, 72, 153],
  [192, 132, 252],
]

const PATTERNS = ['cluster', 'wave', 'spiral', 'grid', 'burst']

function pickColor(i) {
  return PALETTE[i % PALETTE.length]
}

function generate(pattern, w, h) {
  const cx = w / 2
  const cy = h / 2
  const particles = []

  if (pattern === 'cluster') {
    // Dense circular cluster + a sparser outer halo
    for (let i = 0; i < 110; i++) {
      const a = Math.random() * Math.PI * 2
      const r = Math.pow(Math.random(), 1.6) * Math.min(w, h) * 0.38
      particles.push({
        x0: cx + Math.cos(a) * r,
        y0: cy + Math.sin(a) * r,
        size: 0.8 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.7,
        color: pickColor(Math.floor(Math.random() * 3)),
      })
    }
  } else if (pattern === 'wave') {
    // Vertical sine wave column
    const cols = 5
    const rows = 24
    const colWidth = w * 0.4
    const colStartX = cx - colWidth / 2
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        particles.push({
          x0: colStartX + (c / (cols - 1)) * colWidth,
          y0: (r / (rows - 1)) * h,
          size: 1 + Math.random() * 0.8,
          phase: r * 0.4 + c * 0.6,
          speed: 1.0,
          color: pickColor(0),
          waveAmp: 8 + (c - cols / 2) * 1.5,
          waveFreq: 0.6,
        })
      }
    }
  } else if (pattern === 'spiral') {
    // Logarithmic spiral
    const turns = 3
    for (let i = 0; i < 130; i++) {
      const t = i / 130
      const angle = t * turns * Math.PI * 2
      const r = t * Math.min(w, h) * 0.42
      particles.push({
        x0: cx + Math.cos(angle) * r,
        y0: cy + Math.sin(angle) * r,
        size: 0.6 + (1 - t) * 1.6,
        phase: angle,
        speed: 0.5,
        color: pickColor(i % 3),
        spiralBase: angle,
      })
    }
  } else if (pattern === 'grid') {
    // Orderly pulsing grid
    const cols = 9
    const rows = 11
    const padX = w * 0.1
    const padY = h * 0.08
    const gw = w - padX * 2
    const gh = h - padY * 2
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        particles.push({
          x0: padX + (c / (cols - 1)) * gw,
          y0: padY + (r / (rows - 1)) * gh,
          size: 1.2,
          phase: (r + c) * 0.35,
          speed: 0.8,
          color: pickColor(0),
        })
      }
    }
  } else if (pattern === 'burst') {
    // Radial rays from center
    const rays = 14
    const perRay = 9
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2
      for (let j = 1; j <= perRay; j++) {
        const t = j / perRay
        const r = t * Math.min(w, h) * 0.42
        particles.push({
          x0: cx + Math.cos(a) * r,
          y0: cy + Math.sin(a) * r,
          size: 0.6 + (1 - t) * 1.4,
          phase: a + j * 0.2,
          speed: 0.9,
          color: pickColor(j % 3),
          burstAngle: a,
          burstT: t,
        })
      }
    }
  }

  return particles
}

function step(p, t, pattern, w, h) {
  let x = p.x0
  let y = p.y0
  let alpha = 0.55

  if (pattern === 'cluster') {
    const wobble = Math.sin(t * p.speed + p.phase) * 1.2
    x += Math.cos(p.phase + t * 0.3) * wobble
    y += Math.sin(p.phase + t * 0.3) * wobble
    alpha = 0.4 + 0.35 * Math.sin(t * 0.6 + p.phase) ** 2
  } else if (pattern === 'wave') {
    x += Math.sin(t * p.waveFreq + p.phase) * p.waveAmp
    alpha = 0.45 + 0.25 * Math.sin(t * 0.8 + p.phase)
  } else if (pattern === 'spiral') {
    const drift = Math.sin(t * p.speed + p.phase) * 0.6
    x += Math.cos(p.spiralBase + t * 0.2) * drift
    y += Math.sin(p.spiralBase + t * 0.2) * drift
    alpha = 0.45 + 0.3 * Math.sin(t * 0.5 + p.phase)
  } else if (pattern === 'grid') {
    const pulse = 0.4 + 0.5 * (Math.sin(t * p.speed - p.phase) + 1) / 2
    alpha = pulse * 0.7
  } else if (pattern === 'burst') {
    const breath = (Math.sin(t * 0.7 + p.phase) + 1) / 2 // 0..1
    const rOffset = breath * 6
    x += Math.cos(p.burstAngle) * rOffset
    y += Math.sin(p.burstAngle) * rOffset
    alpha = 0.35 + 0.4 * breath * (1 - p.burstT)
  }

  return { x, y, alpha }
}

export default function TimelineParticles({ pattern = 0, height = 280 }) {
  const canvasRef = useRef(null)
  const patternKey = PATTERNS[pattern % PATTERNS.length]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let w = canvas.offsetWidth
    let h = canvas.offsetHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    let particles = generate(patternKey, w, h)
    let raf = 0
    let visible = true
    const startTime = performance.now()

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
      const t = (performance.now() - startTime) / 1000
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        const { x, y, alpha } = step(p, t, patternKey, w, h)
        const [r, g, b] = p.color
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
      particles = generate(patternKey, w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      io.disconnect()
      window.removeEventListener('resize', onResize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [patternKey])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ width: '100%', height: `${height}px`, display: 'block' }}
    />
  )
}
