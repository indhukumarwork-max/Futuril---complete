'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Microscopic Crystal Dust Particle System
 * Features 1000+ crystal-like metallic silver & pearl dust particles.
 * Cursor Interaction: Particles react fluidly to cursor air flow (soft attraction/trailing),
 * then gently drift back into environment with zero sharp snapping.
 */
export default function SpaceParticles({ count = 1000 }: { count?: number }) {
  const silverPointsRef = useRef<THREE.Points>(null);
  const pearlPointsRef = useRef<THREE.Points>(null);

  const prevMouseRef = useRef(new THREE.Vector3(0, 0, 0));

  const [initialPositions, currentPositions, velocities] = useMemo(() => {
    const init = new Float32Array(count * 3);
    const curr = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 11;
      const y = (Math.random() - 0.5) * 7.5;
      const z = (Math.random() - 0.5) * 9;

      init[i * 3] = x;
      init[i * 3 + 1] = y;
      init[i * 3 + 2] = z;

      curr[i * 3] = x;
      curr[i * 3 + 1] = y;
      curr[i * 3 + 2] = z;
    }
    return [init, curr, vel];
  }, [count]);

  const pearlCount = 100;
  const pearlPositions = useMemo(() => {
    const pos = new Float32Array(pearlCount * 3);
    for (let i = 0; i < pearlCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6.5;
    }
    return pos;
  }, []);

  const silverGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    return geo;
  }, [currentPositions]);

  const pearlGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pearlPositions, 3));
    return geo;
  }, [pearlPositions]);

  // Fluid Air-Flow Cursor Interaction & Trail
  useFrame(({ mouse, viewport, clock }, delta) => {
    const t = clock.getElapsedTime();

    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;
    const currentMouseVec = new THREE.Vector3(mouseX, mouseY, 0);

    // Calculate cursor velocity (air draft)
    const mouseVel = new THREE.Vector3().subVectors(currentMouseVec, prevMouseRef.current);
    prevMouseRef.current.copy(currentMouseVec);

    if (silverPointsRef.current) {
      const posAttr = silverPointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      const attractionRadius = 2.0;
      const springFactor = 2.8;
      const damping = 0.92;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const px = posArray[i3];
        const py = posArray[i3 + 1];
        const pz = posArray[i3 + 2];

        const origX = initialPositions[i3];
        const origY = initialPositions[i3 + 1];
        const origZ = initialPositions[i3 + 2];

        // Ambient fluid drift
        const idleX = Math.sin(t * 0.35 + i) * 0.06;
        const idleY = Math.cos(t * 0.28 + i) * 0.06;

        const targetX = origX + idleX;
        const targetY = origY + idleY;
        const targetZ = origZ;

        // Distance from cursor to particle
        const dx = currentMouseVec.x - px;
        const dy = currentMouseVec.y - py;
        const dz = currentMouseVec.z - pz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Fluid air flow attraction & cursor motion trailing
        if (dist < attractionRadius && dist > 0.001) {
          const factor = (1 - dist / attractionRadius) * 0.8;

          // Air flow pull towards cursor path + cursor motion vector transfer
          velocities[i3] += (dx / dist) * factor * delta * 1.5 + mouseVel.x * factor * 0.15;
          velocities[i3 + 1] += (dy / dist) * factor * delta * 1.5 + mouseVel.y * factor * 0.15;
          velocities[i3 + 2] += (dz / dist) * factor * delta * 1.5;
        }

        // Gentle spring return to environmental rest position
        velocities[i3] += (targetX - px) * springFactor * delta;
        velocities[i3 + 1] += (targetY - py) * springFactor * delta;
        velocities[i3 + 2] += (targetZ - pz) * springFactor * delta;

        // Fluid velocity dampening (no snapping)
        velocities[i3] *= damping;
        velocities[i3 + 1] *= damping;
        velocities[i3 + 2] *= damping;

        posArray[i3] += velocities[i3];
        posArray[i3 + 1] += velocities[i3 + 1];
        posArray[i3 + 2] += velocities[i3 + 2];
      }

      posAttr.needsUpdate = true;
    }

    // Soft shimmer on pearl micro-particles
    if (pearlPointsRef.current) {
      const mat = pearlPointsRef.current.material as THREE.PointsMaterial;
      if (mat) {
        mat.opacity = 0.3 + Math.sin(t * 1.8) * 0.12;
      }
    }
  });

  return (
    <group>
      {/* Microscopic Metallic Silver Crystal Dust */}
      <points ref={silverPointsRef} geometry={silverGeometry}>
        <pointsMaterial
          size={0.016}
          color="#f8fafc"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Pearl Holographic Shimmer Dust */}
      <points ref={pearlPointsRef} geometry={pearlGeometry}>
        <pointsMaterial
          size={0.02}
          color="#e2e8f0"
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
