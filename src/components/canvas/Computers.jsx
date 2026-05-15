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
        // x: -0.7 on mobile to counter the right-bias caused by the camera
        // sitting at x=20 (perspective makes a model at world-x=0 lean right
        // on a nearly-square canvas).
        position={isMobile ? [-0.7, -3, -2.2] : [0, -3.25, -1.5]}
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
