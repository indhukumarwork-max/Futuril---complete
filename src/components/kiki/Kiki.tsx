'use client';

import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import PearlSilverMaterial from './KikiMaterial';
import KikiGlow from './KikiGlow';

type Size = 'sm' | 'md' | 'lg';

interface KikiProps {
  size?: Size;
  state?: 'idle' | 'listening' | 'speaking' | 'thinking' | 'excited';
  className?: string;
}

export default function Kiki({ size = 'md', state = 'idle' }: KikiProps) {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);

  // Scale mapping per design system
  const scaleMap: Record<Size, number> = { sm: 0.8, md: 1.1, lg: 1.5 };

  // Idle animations: gentle float/bobbing + 3s soft white glow pulse
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Levitation / idle float
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.05;
    }

    // 3s soft white idle glow pulse
    if (lightRef.current && state === 'idle') {
      const pulse = (Math.sin((t / 3) * Math.PI * 2) + 1) / 2; // 0..1
      lightRef.current.intensity = 0.6 + pulse * 0.4;
    }

    // Subtle eye breathing glow
    if (leftEyeRef.current && rightEyeRef.current) {
      const eyeGlow = 0.8 + Math.sin(t * 2) * 0.2;
      const matL = leftEyeRef.current.material as THREE.MeshStandardMaterial;
      const matR = rightEyeRef.current.material as THREE.MeshStandardMaterial;
      if (matL && matR) {
        matL.emissiveIntensity = eyeGlow;
        matR.emissiveIntensity = eyeGlow;
      }
    }
  });

  return (
    <group ref={groupRef} scale={scaleMap[size]}>
      {/* 1. Main Head / Body Dome */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <PearlSilverMaterial />
      </mesh>

      {/* 2. Sleek Dark Visor Faceplate */}
      <mesh position={[0, 0.05, 0.15]} rotation={[0.2, 0, 0]}>
        <sphereGeometry args={[0.78, 32, 16, 0, Math.PI, 0, Math.PI / 2.2]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.1}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 3. Expressive Digital Eye Nodes */}
      <mesh ref={leftEyeRef} position={[-0.28, 0.12, 0.82]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.0}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.28, 0.12, 0.82]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.0}
          roughness={0.2}
        />
      </mesh>

      {/* 4. Side Ear Pods */}
      <mesh position={[-0.92, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.25, 24]} />
        <PearlSilverMaterial />
      </mesh>
      <mesh position={[0.92, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.25, 24]} />
        <PearlSilverMaterial />
      </mesh>

      {/* 5. Floating Torso Halo Core */}
      <mesh position={[0, -0.85, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.06, 16, 32]} />
        <PearlSilverMaterial />
      </mesh>

      {/* 6. Soft White Idle Glow Light */}
      <KikiGlow ref={lightRef} />
    </group>
  );
}
