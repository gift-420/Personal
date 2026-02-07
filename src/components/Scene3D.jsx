import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Text3D, Center, Environment, useGLTF } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

function CircuitBoard() {
  const circuit = useGLTF('/models/circuit.glb')
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={circuit.scene} scale={2.5} />
      {/* Glowing Points */}
      {[...Array(20)].map((_, i) => (
        <pointLight
          key={i}
          position={[
            Math.sin(i * 0.5) * 3,
            Math.cos(i * 0.8) * 2,
            Math.sin(i * 0.3) * 2
          ]}
          color={i % 3 === 0 ? '#00f3ff' : i % 3 === 1 ? '#9d00ff' : '#ff00c8'}
          intensity={2}
          distance={10}
        />
      ))}
    </group>
  )
}

function BinaryParticles() {
  const particlesRef = useRef()
  const count = 1000
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={Float32Array.from(
            Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 20)
          )}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        color="#00f3ff"
        transparent
        opacity={0.6}
      />
    </points>
  )
}

export default function Scene3D() {
  return (
    <div className="w-full h-screen absolute top-0 left-0 z-0">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        shadows
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
          />
          
          <CircuitBoard />
          <BinaryParticles />
          
          <Center position={[0, -2, 0]}>
            <Text3D
              font="/fonts/helvetiker_bold.typeface.json"
              size={0.5}
              height={0.2}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
            >
              TECH
              <meshNormalMaterial />
            </Text3D>
          </Center>
          
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.8}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
            autoRotate
            autoRotateSpeed={0.5}
          />
          
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
            }
