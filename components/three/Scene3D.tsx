"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, ContactShadows, Preload } from "@react-three/drei";
import * as THREE from "three";

// Background gradient mesh
function BackgroundGradient() {
  return (
    <mesh position={[0, 0, -30]} scale={[100, 100, 1]}>
      <planeGeometry />
      <meshBasicMaterial color="#f8fafc" />
    </mesh>
  );
}

// Animated ambient particles
function AmbientParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 40;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;

    // Alternate between orange and blue
    if (Math.random() > 0.5) {
      colors[i * 3] = 0.976; // Orange R
      colors[i * 3 + 1] = 0.451;
      colors[i * 3 + 2] = 0.086;
    } else {
      colors[i * 3] = 0.231; // Blue R
      colors[i * 3 + 1] = 0.51;
      colors[i * 3 + 2] = 0.965;
    }
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12} // Slightly larger for visibility
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Moving color blobs for aurora effect
function AuroraBlobs() {
  const blob1Ref = useRef<THREE.Mesh>(null);
  const blob2Ref = useRef<THREE.Mesh>(null);
  const blob3Ref = useRef<THREE.Mesh>(null);
  const blob4Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (blob1Ref.current) {
      blob1Ref.current.position.x = -8 + Math.sin(t * 0.2) * 3;
      blob1Ref.current.position.y = 5 + Math.cos(t * 0.15) * 2;
    }
    if (blob2Ref.current) {
      blob2Ref.current.position.x = 8 + Math.sin(t * 0.25) * 3;
      blob2Ref.current.position.y = -3 + Math.cos(t * 0.2) * 2;
    }
    if (blob3Ref.current) {
      blob3Ref.current.position.x = Math.sin(t * 0.15) * 5;
      blob3Ref.current.position.y = 8 + Math.cos(t * 0.1) * 2;
    }
    if (blob4Ref.current) {
      blob4Ref.current.position.x = -5 + Math.sin(t * 0.18) * 4;
      blob4Ref.current.position.y = -6 + Math.cos(t * 0.22) * 3;
    }
  });

  return (
    <>
      {/* Orange blob */}
      <mesh ref={blob1Ref} position={[-8, 5, -20]}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.08} />
      </mesh>

      {/* Blue blob */}
      <mesh ref={blob2Ref} position={[8, -3, -25]}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.06} />
      </mesh>

      {/* Cyan blob */}
      <mesh ref={blob3Ref} position={[0, 8, -22]}>
        <sphereGeometry args={[7, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.05} />
      </mesh>

      {/* Purple blob */}
      <mesh ref={blob4Ref} position={[-5, -6, -18]}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.05} />
      </mesh>
    </>
  );
}

// Cinematic lighting setup
function CinematicLighting() {
  return (
    <>
      {/* Main ambient */}
      <ambientLight intensity={0.8} />

      {/* Key light - warm */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        color="#ffffff"
      />

      {/* Orange rim light */}
      <pointLight
        position={[-10, 5, 5]}
        intensity={1.5}
        color="#f97316"
        distance={30}
      />

      {/* Blue rim light */}
      <pointLight
        position={[10, -5, 5]}
        intensity={1.5}
        color="#3b82f6"
        distance={30}
      />

      {/* Cyan accent */}
      <pointLight
        position={[0, 10, -5]}
        intensity={0.8}
        color="#06b6d4"
        distance={25}
      />

      {/* Ground fill */}
      <pointLight
        position={[0, -10, 0]}
        intensity={0.5}
        color="#e2e8f0"
        distance={20}
      />
    </>
  );
}

// Camera controller for mouse movement
function CameraController() {
  const { camera } = useThree();

  useFrame((state) => {
    // Subtle camera movement based on mouse
    const x = state.pointer.x * 0.3;
    const y = state.pointer.y * 0.2;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, x, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Loading fallback
function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color="#f97316" wireframe />
    </mesh>
  );
}

interface Scene3DProps {
  children?: React.ReactNode;
}

export default function Scene3D({ children }: Scene3DProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 1.5]} // Optimize for performance
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<Loader />}>
          {/* Background */}
          <BackgroundGradient />
          <color attach="background" args={["#f8fafc"]} />

          {/* Lighting */}
          <CinematicLighting />

          {/* Aurora effect */}
          <AuroraBlobs />

          {/* Ambient particles */}
          <AmbientParticles />

          {/* Children (Hero, Stats, Cards) */}
          {children}

          {/* Camera movement */}
          <CameraController />

          {/* Contact shadows for grounding - Optimized */}
          <ContactShadows
            position={[0, -4, 0]}
            opacity={0.3}
            scale={20}
            blur={2.5}
            far={4}
            color="#94a3b8"
            resolution={256}
            frames={1}
          />

          {/* Environment for reflections */}
          <Environment preset="studio" />

          {/* Preload assets */}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
