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
