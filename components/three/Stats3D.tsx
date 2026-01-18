"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, Line } from "@react-three/drei";
import * as THREE from "three";

interface StatItemProps {
  position: [number, number, number];
  value: string;
  label: string;
  color: string;
  delay?: number;
}

function StatItem({ position, value, label, color, delay = 0 }: StatItemProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle float effect
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        <Html
          transform
          distanceFactor={8}
          position={[0, 0, 0]}
          style={{
            transition: "all 0.3s",
            transform: "scale(1)",
          }}
        >
          <div className="flex flex-col items-center justify-center text-center select-none pointer-events-none">
            <div
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight"
              style={{
                color: color,
                textShadow: `0 0 40px ${color}80, 0 0 80px ${color}40`,
              }}
            >
              {value}
            </div>
            <div className="text-sm sm:text-base text-white/80 font-medium mt-2 uppercase tracking-widest">
              {label}
            </div>
          </div>
        </Html>

        {/* Glass platform beneath stat */}
        <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.2, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} />
        </mesh>
      </group>
    </Float>
  );
}

// Glowing line connecting stats
function ConnectionLine({
  start,
  end,
  color,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
}) {
  const points = useMemo(() => [start, end], [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.3}
    />
  );
}

export default function Stats3D() {
  const stats = [
    {
      value: "07",
      label: "Student Startups",
      color: "#3b82f6",
      position: [-4, 1, 0] as [number, number, number],
    },
    {
      value: "10Cr+",
      label: "Revenue Generated",
      color: "#f97316",
      position: [-1.3, 1.5, 0] as [number, number, number],
    },
    {
      value: "₹28.75L",
      label: "Grants Received",
      color: "#10b981",
      position: [1.3, 1.5, 0] as [number, number, number],
    },
    {
      value: "48",
      label: "Incubated Startups",
      color: "#8b5cf6",
      position: [4, 1, 0] as [number, number, number],
    },
  ];

  return (
    <group position={[0, -1, 0]}>
      {stats.map((stat, index) => (
        <StatItem
          key={index}
          position={stat.position}
          value={stat.value}
          label={stat.label}
          color={stat.color}
          delay={index * 0.5}
        />
      ))}

      {/* Connection lines between stats */}
      <ConnectionLine start={[-4, 0.5, 0]} end={[-1.3, 1, 0]} color="#ffffff" />
      <ConnectionLine start={[-1.3, 1, 0]} end={[1.3, 1, 0]} color="#ffffff" />
      <ConnectionLine start={[1.3, 1, 0]} end={[4, 0.5, 0]} color="#ffffff" />
    </group>
  );
}
