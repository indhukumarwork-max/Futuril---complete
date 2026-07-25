'use client';

import * as THREE from 'three';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import PearlSilverMaterial from './KikiMaterial';
import KikiGlow from './KikiGlow';

type Size = 'sm' | 'md' | 'lg';

export interface KikiProps {
  size?: Size;
  state?: 'idle' | 'listening' | 'speaking' | 'thinking' | 'excited';
  wink?: boolean;
  shimmer?: boolean;
  float?: boolean;
}

export default function Kiki({
  size = 'md',
  state = 'idle',
  wink = false,
  shimmer = false,
  float = false,
}: KikiProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  // Size scale mapping (sm reduced by 30-40% to ~0.24 for delicate solar mascot)
  const scaleMap: Record<Size, number> = { sm: 0.24, md: 0.7, lg: 1.1 };

  // Create rounded 5-point star 3D geometry
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 0.85;
    const innerRadius = 0.42;

    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    }),
    []
  );

  // Idle floating and animation kinetics
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Floating bobbing motion only when float === true
    if (groupRef.current && float) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.05;
    }

    // Smooth eye wink kinetics
    if (rightEyeRef.current) {
      const targetScaleY = wink ? 0.08 : 1.0;
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(
        rightEyeRef.current.scale.y,
        targetScaleY,
        0.2
      );
    }

    // Pearl shimmer light intensity
    if (lightRef.current && state === 'idle') {
      const pulse = (Math.sin((t / 3) * Math.PI * 2) + 1) / 2;
      const baseIntensity = shimmer ? 1.5 : 0.6;
      lightRef.current.intensity = baseIntensity + pulse * 0.3;
    }
  });

  return (
    <group ref={groupRef} scale={scaleMap[size]}>
      {/* 1. Five-Point Star Mascot Body */}
      <group position={[0, 0, -0.2]}>
        <mesh>
          <extrudeGeometry args={[starShape, extrudeSettings]} />
          <PearlSilverMaterial shimmer={shimmer} />
        </mesh>
      </group>

      {/* 2. Glassmorphic Visor Display */}
      <mesh position={[0, 0, 0.12]}>
        <circleGeometry args={[0.32, 32]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
        />
      </mesh>

      {/* 3. Left Eye (Glowing Node) */}
      <mesh position={[-0.11, 0.02, 0.14]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* 4. Right Eye (Winking Node) */}
      <mesh ref={rightEyeRef} position={[0.11, 0.02, 0.14]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* 5. Soft Pearl Light Glow */}
      <KikiGlow ref={lightRef} />
    </group>
  );
}
