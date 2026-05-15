import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, useGLTF } from '@react-three/drei'

import CanvasLoader from '../Loader'
import { useIsMobile } from '../../lib/hooks/useIsMobile'
import HeroParticles from './HeroParticles'
import CinematicCamera from './CinematicCamera'

const Computers = ({ isMobile }) => {
  const computer = useGLTF('./desktop_pc/scene.gltf')

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.6 : 0.75}
        // x: -2.5 on mobile counters the right-bias coming from two
        // things stacking: (1) the camera sits at x=20 so a model at
        // world-x=0 has perspective lean to the right, and (2) the GLTF
        // itself is asymmetric — the PC tower sits to the right of the
        // monitor, pulling the visual center of mass off-axis.
        position={isMobile ? [-2.5, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  )
}

const ComputersCanvas = () => {
  const isMobile = useIsMobile(500)

  return (
    <Canvas
      frameloop="always"
      shadows
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <CinematicCamera />
        <Computers isMobile={isMobile} />
        <HeroParticles count={isMobile ? 400 : 800} />
      </Suspense>

      <Preload all />
    </Canvas>
  )
}

export default ComputersCanvas
