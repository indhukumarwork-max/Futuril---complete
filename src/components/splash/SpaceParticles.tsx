'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Premium Monochrome Deep-Space Dust & Orbit Micro-Glitter Particles
 * Inspired by Apple Vision Pro / Nothing OS orbital minimalism.
 */
export default function SpaceParticles({ count = 450 }: { count?: number }) {
  const spacePointsRef = useRef<THREE.Points>(null);
  const orbitDustRef = useRef<THREE.Points>(null);

  // 1. Random Volume Space Dust (Monochrome #f8fafc)
  const spacePositions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, [count]);

  const spaceGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(spacePositions, 3));
    return geo;
  }, [spacePositions]);

  // 2. Micro Orbit Stardust Particles (Gliding along orbit ellipse)
  const orbitParticleCount = 48;
  const [orbitPositions, orbitPhases] = useMemo(() => {
    const pos = new Float32Array(orbitParticleCount * 3);
    const ph = new Float32Array(orbitParticleCount);

    for (let i = 0; i < orbitParticleCount; i++) {
      ph[i] = (i / orbitParticleCount) * Math.PI * 2;
    }
    return [pos, ph];
  }, []);

  const orbitGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3));
    return geo;
  }, [orbitPositions]);

  // Gentle micro-twinkle and slow stardust orbit glide
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Twinkle space dust
    if (spacePointsRef.current) {
      const mat = spacePointsRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.opacity = 0.28 + Math.sin(t * 1.5) * 0.08;
      }
    }

    // Glide micro stardust along orbit
    if (orbitDustRef.current) {
      const posAttr = orbitDustRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const radiusX = 1.35;
      const radiusY = 0.65;
      const tiltX = 0.4;

      for (let i = 0; i < orbitParticleCount; i++) {
        const theta = orbitPhases[i] + t * 0.15; // Slow ambient orbit glide
        const rawX = Math.cos(theta) * radiusX;
        const rawZ = Math.sin(theta) * radiusY;

        const vec = new THREE.Vector3(rawX, 0, rawZ);
        vec.applyEuler(new THREE.Euler(tiltX, 0, 0));

        posAttr.setXYZ(i, vec.x, vec.y, vec.z);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Background Micro Space Dust */}
      <points ref={spacePointsRef} geometry={spaceGeometry}>
        <pointsMaterial
          size={0.018}
          color="#f8fafc"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Orbit Line Micro-Glitter */}
      <points ref={orbitDustRef} geometry={orbitGeometry}>
        <pointsMaterial
          size={0.022}
          color="#e2e8f0"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
