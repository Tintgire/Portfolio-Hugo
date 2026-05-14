import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERTEX = /* glsl */ `
  attribute vec2 aOffset;
  attribute float aSeed;
  attribute vec3 aColor;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uTime;
  uniform float uPixelRatio;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 origin = position.xy;
    vec2 target = uMouse + aOffset;
    vec2 pos = mix(origin, target, uHover);

    float wobbleAmp = mix(2.5, 0.8, uHover);
    pos.x += sin(uTime * 0.6 + aSeed * 12.5) * wobbleAmp;
    pos.y += cos(uTime * 0.5 + aSeed * 8.3) * wobbleAmp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 0.0, 1.0);

    float scintil = 0.6 + 0.4 * sin(uTime * 2.4 + aSeed * 30.0);
    gl_PointSize = (3.5 + uHover * 1.8) * scintil * uPixelRatio;

    vColor = aColor;
    vAlpha = 0.5 + 0.5 * scintil;
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
  [0.569, 0.369, 1.000], // #915EFF
  [0.753, 0.518, 0.988], // #c084fc
  [0.925, 0.282, 0.600], // #ec4899
]

function sampleShapeOffsets(text, w, h) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
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
        // Centered offsets, Y inverted to Three.js up convention
        offsets.push([x - w / 2, h / 2 - y])
      }
    }
  }
  return offsets
}

export default function ExperienceParticlesBackground({ count = 4500 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let cleanup = null
    let pendingRO = null

    const tryInit = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return false
      try {
        cleanup = setup(w, h)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[ExperienceParticlesBackground] WebGL setup failed:', err)
      }
      return true
    }

    if (!tryInit()) {
      pendingRO = new ResizeObserver((entries) => {
        const e = entries[0]
        if (e.contentRect.width > 0 && e.contentRect.height > 0) {
          pendingRO.disconnect()
          pendingRO = null
          tryInit()
        }
      })
      pendingRO.observe(container)
    }

    return () => {
      if (pendingRO) pendingRO.disconnect()
      if (cleanup) cleanup()
    }

    function setup(initW, initH) {
      let w = initW
      let h = initH

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 100)
      camera.position.z = 10

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      // Cap pixelRatio at 1 — this canvas can be very tall (full timeline)
      // and pixelRatio 2 was pushing the drawing buffer past GPU limits on
      // some devices, leading to a context-lost / blank canvas.
      renderer.setPixelRatio(1)
      renderer.setSize(w, h, false)
      renderer.setClearColor(0x000000, 0)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.style.display = 'block'
      container.appendChild(renderer.domElement)

      // Sample shape into a small region (~280×280) — the size of the cluster around the mouse
      const SHAPE = 280
      const offsets = sampleShapeOffsets('{ }', SHAPE, SHAPE)

      const positions = new Float32Array(count * 3)
      const offsetAttr = new Float32Array(count * 2)
      const seeds = new Float32Array(count)
      const colors = new Float32Array(count * 3)

      for (let i = 0; i < count; i++) {
        // Origin: random scatter across the full canvas (centered coords)
        positions[3 * i] = (Math.random() - 0.5) * w
        positions[3 * i + 1] = (Math.random() - 0.5) * h
        positions[3 * i + 2] = 0

        const o = offsets.length > 0 ? offsets[i % offsets.length] : [0, 0]
        offsetAttr[2 * i] = o[0]
        offsetAttr[2 * i + 1] = o[1]

        seeds[i] = Math.random()

        const c = PALETTE[Math.floor(Math.random() * PALETTE.length)]
        colors[3 * i] = c[0]
        colors[3 * i + 1] = c[1]
        colors[3 * i + 2] = c[2]
      }

      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.setAttribute('aOffset', new THREE.BufferAttribute(offsetAttr, 2))
      geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
      geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3))

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(-99999, -99999) },
          uHover: { value: 0 },
          uPixelRatio: { value: renderer.getPixelRatio() },
        },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
      })

      const points = new THREE.Points(geo, material)
      scene.add(points)

      // Mouse tracked via window — canvas itself has pointer-events: none so cards stay clickable
      let mouseX = -99999
      let mouseY = -99999
      let hoverTarget = 0
      let hover = 0
      let raf = 0
      const start = performance.now()
      let visible = true

      const onMouseMove = (e) => {
        const rect = container.getBoundingClientRect()
        const mxScreen = e.clientX - rect.left
        const myScreen = e.clientY - rect.top
        // Convert to centered coords (Three.js world) — Y inverted
        mouseX = mxScreen - w / 2
        mouseY = -myScreen + h / 2
        // Hover ON when mouse is anywhere over this canvas's bounding box
        if (mxScreen >= 0 && mxScreen <= w && myScreen >= 0 && myScreen <= h) {
          hoverTarget = 1
        } else {
          hoverTarget = 0
        }
      }
      const onMouseLeave = () => { hoverTarget = 0 }
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseout', onMouseLeave)

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
        material.uniforms.uMouse.value.set(mouseX, mouseY)
        renderer.render(scene, camera)
        raf = requestAnimationFrame(tick)
      }
      tick()

      const ro = new ResizeObserver(() => {
        const nw = container.clientWidth
        const nh = container.clientHeight
        if (nw === 0 || nh === 0 || (nw === w && nh === h)) return
        w = nw
        h = nh
        renderer.setSize(w, h, false)
        camera.left = -w / 2
        camera.right = w / 2
        camera.top = h / 2
        camera.bottom = -h / 2
        camera.updateProjectionMatrix()
        const orig = geo.getAttribute('position')
        for (let i = 0; i < count; i++) {
          orig.setXYZ(i, (Math.random() - 0.5) * w, (Math.random() - 0.5) * h, 0)
        }
        orig.needsUpdate = true
      })
      ro.observe(container)

      return () => {
        io.disconnect()
        ro.disconnect()
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseout', onMouseLeave)
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
      className="absolute inset-0 pointer-events-none"
    />
  )
}
