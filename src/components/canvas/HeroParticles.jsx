import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as random from 'maath/random/dist/maath-random.esm'
import { useReducedMotion } from '../../lib/hooks/useReducedMotion'

export default function HeroParticles({ count = 800 }) {
  const ref = useRef()
  const reduced = useReducedMotion()
  const positions = useMemo(
    () => random.inSphere(new Float32Array(count * 3), { radius: 6 }),
    [count]
  )

  useFrame((_, delta) => {
    if (!ref.current || reduced) return
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
