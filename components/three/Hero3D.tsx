"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

// Glowing Idea Bulb - Abstract representation
function IdeaBulb() {
  const groupRef = useRef<THREE.Group>(null);
  const bulbRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      groupRef.current.rotation.x =
        Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
    }
    if (bulbRef.current) {
      // Pulsing scale
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      bulbRef.current.scale.setScalar(pulse);
    }
    if (glowRef.current) {
      // Glow pulse
      const glowPulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
      glowRef.current.scale.setScalar(glowPulse * 1.8);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Main bulb shape */}
        <mesh ref={bulbRef}>
          <dodecahedronGeometry args={[1.5, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.5}
            chromaticAberration={0.2}
            anisotropy={0.3}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.1}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1400]}
            color="#f97316"
            transmission={0.95}
            roughness={0.1}
          />
        </mesh>

        {/* Inner glow core */}
        <mesh scale={0.6}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ff6b00" transparent opacity={0.8} />
        </mesh>

        {/* Outer glow */}
        <mesh ref={glowRef} scale={1.8}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            color="#f97316"
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Floating particles around the bulb */}
        <FloatingParticles />
      </group>
    </Float>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    }
  });

  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const radius = 2.5 + Math.random() * 1;
    return {
      position: [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 3,
        Math.sin(angle) * radius,
      ] as [number, number, number],
      scale: 0.05 + Math.random() * 0.08,
      color: i % 2 === 0 ? "#f97316" : "#3b82f6",
    };
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.scale, 8, 8]} />
          <meshBasicMaterial color={particle.color} />
        </mesh>
      ))}
    </group>
  );
}

// Orbiting rings around the bulb
function OrbitingRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.5;
      ring1Ref.current.rotation.y = t * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = t * 0.3;
      ring2Ref.current.rotation.z = t * 0.4;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = t * 0.4;
      ring3Ref.current.rotation.z = t * 0.2;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[3.5, 0.015, 16, 100]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
      </mesh>
      <mesh ref={ring3Ref}>
        <torusGeometry args={[4, 0.01, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} />
      </mesh>
    </>
  );
}

export default function Hero3D() {
  return (
    <group position={[0, 0, 0]}>
      <IdeaBulb />
      <OrbitingRings />
    </group>
  );
}
