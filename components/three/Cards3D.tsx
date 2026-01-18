"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface CardData {
  name: string;
  revenue: string;
  icon: string;
  color: string;
}

interface GlassCardProps {
  data: CardData;
  position: [number, number, number];
  index: number;
}

function GlassCard({ data, position, index }: GlassCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;

      // Hover rotation effect
      if (hovered) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          0.15,
          0.1
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          -0.1,
          0.1
        );
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          0,
          0.1
        );
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          0,
          0.1
        );
      }
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group
        ref={groupRef}
        position={position}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Glass card background */}
        <RoundedBox args={[2.8, 3.5, 0.15]} radius={0.15} smoothness={4}>
          <meshPhysicalMaterial
            color="#1e293b"
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.1}
            transmission={0.3}
            thickness={0.5}
            envMapIntensity={1}
          />
        </RoundedBox>

        {/* Glowing border */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[2.9, 3.6]} />
          <meshBasicMaterial
            color={data.color}
            transparent
            opacity={hovered ? 0.3 : 0.1}
          />
        </mesh>

        {/* Rank badge */}
        <mesh position={[1, 1.4, 0.1]}>
          <circleGeometry args={[0.35, 32]} />
          <meshBasicMaterial color={data.color} />
        </mesh>

        {/* HTML Content */}
        <Html
          transform
          distanceFactor={5}
          position={[0, 0, 0.1]}
          style={{ pointerEvents: "none" }}
        >
          <div
            className="w-[200px] text-center select-none"
            style={{
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.3s",
            }}
          >
            {/* Rank */}
            <div
              className="absolute -top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center text-lg font-black"
              style={{ backgroundColor: data.color, color: "#0f172a" }}
            >
              #{index + 1}
            </div>

            {/* Icon */}
            <div className="text-5xl mb-3">{data.icon}</div>

            {/* Company Name */}
            <h3 className="text-white font-bold text-sm leading-tight mb-4 px-2">
              {data.name}
            </h3>

            {/* Revenue */}
            <div className="border-t border-white/20 pt-3">
              <p className="text-[10px] uppercase tracking-wider text-white/50 mb-1">
                Revenue
              </p>
              <p className="text-2xl font-black" style={{ color: data.color }}>
                {data.revenue}
              </p>
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
}

export default function Cards3D() {
  const cards: CardData[] = [
    {
      name: "BiddrX Tech India Pvt. Ltd.",
      revenue: "10 Cr+",
      icon: "💎",
      color: "#f97316",
    },
    {
      name: "Putato e Solutions Pvt. Ltd.",
      revenue: "8 Cr+",
      icon: "🥔",
      color: "#10b981",
    },
    {
      name: "BroadBuy Technovative",
      revenue: "6 Cr+",
      icon: "🛒",
      color: "#3b82f6",
    },
    {
      name: "Renaissance Global Marketing",
      revenue: "5 Cr+",
      icon: "🌐",
      color: "#8b5cf6",
    },
    {
      name: "Three Point One Four Glasses",
      revenue: "85L+",
      icon: "👓",
      color: "#06b6d4",
    },
  ];

  // Position cards in a curved arrangement
  const positions: [number, number, number][] = [
    [-5, 0, 1],
    [-2.5, 0.3, 0],
    [0, 0.5, -0.5],
    [2.5, 0.3, 0],
    [5, 0, 1],
  ];

  return (
    <group position={[0, 0, 0]}>
      {cards.map((card, index) => (
        <GlassCard
          key={index}
          data={card}
          position={positions[index]}
          index={index}
        />
      ))}
    </group>
  );
}
