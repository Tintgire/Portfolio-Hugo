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
