'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

interface DNAHelixProps {
  pulse?: boolean;
  dimmed?: boolean;
  position?: [number, number, number];
  scale?: number;
}

/**
 * Premium 3D Liquid Chrome & Glass DNA Hero Sculpture
 * Loads professionally modelled binary GLB asset (/models/dna.glb) via Drei useGLTF.
 * Wrapped in Drei Float for smooth museum sculpture behavior with PBR chrome materials.
 */
export default function DNAHelix({
  pulse = false,
  dimmed = false,
  position = [0, 0, -1.5],
  scale = 0.72,
}: DNAHelixProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/dna.glb');

  // Clone scene instance and apply luxury chrome + subtle pearl specular physical material
  const clonedScene = useMemo(() => {
    const cloned = scene.clone();
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0.98,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 1.0,
      ior: 2.4,
      transmission: dimmed ? 0.05 : 0.12,
      thickness: 0.4,
      emissive: '#f8fafc',
      emissiveIntensity: dimmed ? 0.03 : 0.12,
      transparent: true,
      opacity: dimmed ? 0.42 : 0.92,
      depthWrite: true,
      depthTest: true,
    });

    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = chromeMat;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene, dimmed]);

  // Extremely slow rotation & museum drift
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // Slow continuous rotation (~40s per revolution)
      groupRef.current.rotation.y += delta * 0.15;

      // Subtle rotational drift & ~25 degree tilt
      groupRef.current.rotation.z = -0.44 + Math.cos(t * 0.3) * 0.02;
      groupRef.current.rotation.x = 0.26 + Math.sin(t * 0.2) * 0.015;
    }

    // Handle light pulse trigger during Kiki front-center pause
    if (clonedScene) {
      const energyPulse = 0.12 + Math.sin(t * 1.5) * 0.06;
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
          if (mat) {
            const targetEmissive = pulse ? 0.55 : dimmed ? 0.03 : energyPulse;
            mat.emissiveIntensity = THREE.MathUtils.lerp(
              mat.emissiveIntensity,
              targetEmissive,
              0.1
            );
          }
        }
      });
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef} position={position} scale={scale}>
        <primitive object={clonedScene} />
      </group>
    </Float>
  );
}

// Preload GLB model asset
useGLTF.preload('/models/dna.glb');
