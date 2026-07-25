'use client';

import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import OrbitRings from './OrbitRings';
import SpaceParticles from './SpaceParticles';
import Kiki from '../kiki/Kiki';

interface SplashSceneProps {
  onSequenceComplete: () => void;
  onFrontCenterReached: () => void;
}

/**
 * Single Unified 3D WebGL Scene Hierarchy:
 * Canvas
 *  ├── SpaceParticles (Stars & Micro Stardust)
 *  ├── OrbitRings (5 Complete 360° THREE.EllipseCurve Vector Rings)
 *  ├── FUTURIL 3D Text Mesh (Real 3D Object at z = 0)
 *  ├── Kiki 3D Mesh (Outer Orbit Satellite)
 *  └── Lighting
 *
 * Full 360° Orbit Visibility & Zero Edge Clipping:
 * Viewport container max-w-4xl h-[560px] with camera z = 5.2 guarantees the entire 360° outer orbit
 * (outerRadiusX = 2.432) fits comfortably with generous dark negative space padding.
 */
function SplashScene({ onSequenceComplete, onFrontCenterReached }: SplashSceneProps) {
  const kikiGroupRef = useRef<THREE.Group>(null);
  const logoGroupRef = useRef<THREE.Group>(null);
  const logoMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const [isWinking, setIsWinking] = useState(false);
  const [isShimmering, setIsShimmering] = useState(false);

  // Solar orbit radii
  const radiusX = 1.6;
  const radiusY = 0.75;
  const outerMultiplier = 1.52;
  const outerRadiusX = radiusX * outerMultiplier; // 2.432
  const outerRadiusY = radiusY * outerMultiplier; // 1.14

  const sequenceDuration = 3.0; // Exactly 3.0 seconds revolution

  const startTimeRef = useRef<number | null>(null);
  const reachedFrontRef = useRef(false);
  const finishedRef = useRef(false);

  useFrame(({ clock }) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = clock.getElapsedTime();
    }

    const elapsed = clock.getElapsedTime() - startTimeRef.current;
    const progress = Math.min(elapsed / sequenceDuration, 1.0);

    // Smooth entrance scale (0.96 -> 1.0)
    if (logoGroupRef.current) {
      const entrance = Math.min(elapsed / 0.8, 1.0);
      const scale = 0.96 + entrance * 0.04;
      logoGroupRef.current.scale.set(scale, scale, scale);
    }

    // Subtle entrance shimmer pulse across 3D letter material
    if (logoMaterialRef.current && elapsed <= 1.0) {
      const pulse = Math.sin((elapsed / 1.0) * Math.PI);
      logoMaterialRef.current.emissiveIntensity = 0.15 + pulse * 0.25;
    }

    // Orbital angle theta starting at 0 (Right side of outer ring) -> 2π (360° full orbit)
    const theta = progress * Math.PI * 2;
    const tiltX = 0.4; // ~23° orbital tilt

    if (kikiGroupRef.current) {
      // Calculate 3D position exclusively along the outermost orbit ring
      const rawX = Math.cos(theta) * outerRadiusX;
      const rawZ = Math.sin(theta) * outerRadiusY;

      // Apply 3D orbital transform
      const vec = new THREE.Vector3(rawX, 0, rawZ);
      vec.applyEuler(new THREE.Euler(tiltX, 0, 0));

      kikiGroupRef.current.position.copy(vec);
      kikiGroupRef.current.rotation.y = -theta + Math.PI / 2;
    }

    // Complete 1 Full Revolution on Outer Ring at 3.0s (Stops back on right side of outer ring)
    if (progress >= 1.0 && !reachedFrontRef.current) {
      reachedFrontRef.current = true;
      setIsWinking(true);
      setIsShimmering(true);
      onFrontCenterReached();

      // Pause 0.8s on outer ring (3.0s to 3.8s) before transition
      setTimeout(() => {
        if (!finishedRef.current) {
          finishedRef.current = true;
          onSequenceComplete();
        }
      }, 800);
    }
  });

  return (
    <>
      {/* 1. Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 7, 5]} intensity={1.3} />
      <pointLight position={[-5, 3, -4]} intensity={0.4} color="#e2e8f0" />
      <pointLight position={[0, -3, 3]} intensity={0.3} color="#ffffff" />

      {/* 2. Stars & Space Dust Particles */}
      <SpaceParticles count={450} />

      {/* 3. 5 Complete 360° Vector Orbit Rings (z = -0.15) */}
      <OrbitRings radiusX={radiusX} radiusY={radiusY} />

      {/* 4. FUTURIL 3D Text Mesh (Real 3D Object at z = 0 with solid depth testing) */}
      <group ref={logoGroupRef} position={[0, 0, 0]}>
        <Text
          fontSize={0.48}
          letterSpacing={0.34}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          fontWeight={800}
          material-depthTest={true}
          material-depthWrite={true}
          material-alphaTest={0.5}
        >
          FUTURIL
          <meshPhysicalMaterial
            ref={logoMaterialRef}
            color="#f8fafc"
            metalness={0.65}
            roughness={0.15}
            clearcoat={1.0}
            sheen={0.5}
            sheenColor="#ffffff"
            emissive="#e2e8f0"
            emissiveIntensity={0.15}
            depthWrite={true}
            depthTest={true}
            alphaTest={0.5}
          />
        </Text>
      </group>

      {/* 5. Kiki 3D Mesh (Revolves on Outermost Orbit with True WebGL Depth Occlusion) */}
      <group ref={kikiGroupRef}>
        <Kiki size="sm" state="idle" wink={isWinking} shimmer={isShimmering} float={false} />
      </group>
    </>
  );
}

export default function SplashScreen() {
  const router = useRouter();
  const [wordmarkShining, setWordmarkShining] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleFrontCenterReached = () => {
    setWordmarkShining(true);
  };

  const handleSequenceComplete = () => {
    setIsFadingOut(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('futuril_splash_seen', 'true');
    }
    setTimeout(() => {
      router.push('/login');
    }, 600);
  };

  return (
    <AnimatePresence>
      {!isFadingOut && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#030712] text-[#f8fafc] overflow-hidden select-none"
        >
          {/* Centered Viewport Container (Expanded for full 360° orbit visibility without edge clipping) */}
          <div className="relative w-full max-w-4xl h-[560px] flex items-center justify-center">
            <Canvas
              camera={{ position: [0, 0, 5.2], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
            >
              <Suspense fallback={null}>
                <SplashScene
                  onSequenceComplete={handleSequenceComplete}
                  onFrontCenterReached={handleFrontCenterReached}
                />
              </Suspense>
            </Canvas>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
