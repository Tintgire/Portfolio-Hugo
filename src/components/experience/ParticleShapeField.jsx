import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERTEX = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aSeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uHover;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    // Smooth hover lerp between random scatter and shape target.
    vec3 pos = mix(position, aTarget, uHover);

    // Subtle organic wobble — strongest at rest, calmer when in shape.
    float wobbleAmp = mix(2.5, 0.6, uHover);
    pos.x += sin(uTime * 0.6 + aSeed * 12.5) * wobbleAmp;
    pos.y += cos(uTime * 0.5 + aSeed * 8.3) * wobbleAmp;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    // Size + scintillation
    float scintil = 0.6 + 0.4 * sin(uTime * 2.4 + aSeed * 30.0);
    gl_PointSize = (4.5 + uHover * 3.5) * scintil * uPixelRatio;

    vColor = aColor;
    vAlpha = 0.55 + 0.45 * scintil;
  }
`

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(vColor, a);
  }
`

const PALETTE = [
  [0.569, 0.369, 1.000], // #915EFF — violet primary
  [0.753, 0.518, 0.988], // #c084fc — lavender
  [0.925, 0.282, 0.600], // #ec4899 — pink
]

function sampleShape(text, width, height, sampleStep = 3) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'
  ctx.font = `900 ${Math.floor(height * 0.95)}px "JetBrains Mono", "Menlo", "Consolas", monospace`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // Render "{" and "}" spaced apart so the field reads as two clusters,
  // like the antigravity dumbbells.
  const yMid = height / 2 + height * 0.04
  ctx.fillText('{', width * 0.3, yMid)
  ctx.fillText('}', width * 0.7, yMid)

  const data = ctx.getImageData(0, 0, width, height).data
  const targets = []
  for (let y = 0; y < height; y += sampleStep) {
    for (let x = 0; x < width; x += sampleStep) {
      const alpha = data[(y * width + x) * 4 + 3]
      if (alpha > 180) {
        targets.push([x - width / 2, height / 2 - y, 0])
      }
    }
  }
  return targets
}

export default function ParticleShapeField({ height = 280, count = 1800 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = container.clientWidth
    let h = container.clientHeight

    // Container may be 0×0 at first paint — wait for layout via ResizeObserver
    if (w === 0 || h === 0) {
      const ro = new ResizeObserver((entries) => {
        const e = entries[0]
        if (e.contentRect.width > 0 && e.contentRect.height > 0) {
          ro.disconnect()
          // Re-trigger by re-running this effect's body
          init(e.contentRect.width, e.contentRect.height)
        }
      })
      ro.observe(container)
      return () => ro.disconnect()
    }

    return init(w, h)

    function init(initW, initH) {
      try {
        return setup(initW, initH)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[ParticleShapeField] WebGL setup failed:', err)
        return undefined
      }
    }

    function setup(initW, initH) {
      w = initW
      h = initH

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 100)
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(w, h, false)
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    const targets = sampleShape('{ }', w, h)

    const positions = new Float32Array(count * 3)
    const targetPos = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // Origin: random scatter across the field
      positions[3 * i] = (Math.random() - 0.5) * w
      positions[3 * i + 1] = (Math.random() - 0.5) * h
      positions[3 * i + 2] = 0

      // Target: pick from shape samples, cycle if needed
      const t = targets.length > 0 ? targets[i % targets.length] : [0, 0, 0]
      targetPos[3 * i] = t[0]
      targetPos[3 * i + 1] = t[1]
      targetPos[3 * i + 2] = 0

      seeds[i] = Math.random()

      const c = PALETTE[Math.floor(Math.random() * PALETTE.length)]
      colors[3 * i] = c[0]
      colors[3 * i + 1] = c[1]
      colors[3 * i + 2] = c[2]
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aTarget', new THREE.BufferAttribute(targetPos, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHover: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })

    const points = new THREE.Points(geo, material)
    scene.add(points)

    let hoverTarget = 0
    let hover = 0
    let raf = 0
    const start = performance.now()
    let visible = true

    const onEnter = () => { hoverTarget = 1 }
    const onLeave = () => { hoverTarget = 0 }
    container.addEventListener('mouseenter', onEnter)
    container.addEventListener('mouseleave', onLeave)
    container.addEventListener('touchstart', onEnter, { passive: true })
    container.addEventListener('touchend', onLeave)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) tick()
    })
    io.observe(container)

    const tick = () => {
      if (!visible) {
        raf = 0
        return
      }
      hover += (hoverTarget - hover) * 0.07
      material.uniforms.uTime.value = reduced ? 0 : (performance.now() - start) / 1000
      material.uniforms.uHover.value = hover
      renderer.render(scene, camera)
      raf = requestAnimationFrame(tick)
    }
    tick()

    const onResize = () => {
      const nw = container.clientWidth
      const nh = container.clientHeight
      if (nw === 0 || nh === 0) return
      renderer.setSize(nw, nh, false)
      camera.left = -nw / 2
      camera.right = nw / 2
      camera.top = nh / 2
      camera.bottom = -nh / 2
      camera.updateProjectionMatrix()
      // Re-sample the shape and re-assign targets at the new dimensions
      const newTargets = sampleShape('{ }', nw, nh)
      const arr = geo.getAttribute('aTarget')
      for (let i = 0; i < count; i++) {
        const t = newTargets.length > 0 ? newTargets[i % newTargets.length] : [0, 0, 0]
        arr.setXYZ(i, t[0], t[1], 0)
      }
      arr.needsUpdate = true
      // Re-scatter origins to fit new dimensions
      const orig = geo.getAttribute('position')
      for (let i = 0; i < count; i++) {
        orig.setXYZ(i,
          (Math.random() - 0.5) * nw,
          (Math.random() - 0.5) * nh,
          0,
        )
      }
      orig.needsUpdate = true
    }
    window.addEventListener('resize', onResize)

      return () => {
        io.disconnect()
        window.removeEventListener('resize', onResize)
        container.removeEventListener('mouseenter', onEnter)
        container.removeEventListener('mouseleave', onLeave)
        container.removeEventListener('touchstart', onEnter)
        container.removeEventListener('touchend', onLeave)
        if (raf) cancelAnimationFrame(raf)
        geo.dispose()
        material.dispose()
        renderer.dispose()
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement)
        }
      }
    }
  }, [count])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ width: '100%', height: `${height}px`, cursor: 'pointer' }}
    />
  )
}
