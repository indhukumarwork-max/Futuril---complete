'use client';

import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import OrbitRings from './OrbitRings';
import SpaceParticles from './SpaceParticles';
import Kiki from '../kiki/Kiki';
import DNAHelix from '../3d/DNAHelix';

interface SplashSceneProps {
  onSequenceComplete: () => void;
  onFrontCenterReached: () => void;
}

/**
 * Premium 3D Permanent Luxury Sculpture Splash Scene:
 * - Permanent 3D DNA Hero Sculpture (100% independent of mouse cursor tracking).
 * - Microscopic Crystal Particles with fluid air-flow cursor interaction.
 * - 3D Liquid Chrome Torus Orbit Rings & 3D FUTURIL metallic wordmark.
 * - Kiki orbits smoothly on outer ring -> pause front-center -> wink + pearl shimmer -> smooth transition to /login.
 */
function SplashScene({ onSequenceComplete, onFrontCenterReached }: SplashSceneProps) {
  const kikiGroupRef = useRef<THREE.Group>(null);
  const logoGroupRef = useRef<THREE.Group>(null);
  const logoMaterialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const [isWinking, setIsWinking] = useState(false);
  const [isShimmering, setIsShimmering] = useState(false);
  const [dnaPulse, setDnaPulse] = useState(false);

  // Solar orbit radii
  const radiusX = 1.6;
  const radiusY = 0.75;
  const outerMultiplier = 1.52;
  const outerRadiusX = radiusX * outerMultiplier; // 2.432
  const outerRadiusY = radiusY * outerMultiplier; // 1.14

  const sequenceDuration = 3.0; // Exactly 3.0s revolution

  const startTimeRef = useRef<number | null>(null);
  const reachedFrontRef = useRef(false);
  const finishedRef = useRef(false);

  useFrame(({ clock, camera }) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = clock.getElapsedTime();
    }

    const elapsed = clock.getElapsedTime() - startTimeRef.current;
    const progress = Math.min(elapsed / sequenceDuration, 1.0);

    // Camera slow dolly in (5.2 -> 4.95)
    const targetZ = 5.2 - progress * 0.25;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);

    // Smooth logo entrance scale
    if (logoGroupRef.current) {
      const entrance = Math.min(elapsed / 0.8, 1.0);
      const scale = 0.96 + entrance * 0.04;
      logoGroupRef.current.scale.set(scale, scale, scale);
    }

    // Entrance shimmer pulse across 3D letter material
    if (logoMaterialRef.current && elapsed <= 1.0) {
      const pulseVal = Math.sin((elapsed / 1.0) * Math.PI);
      logoMaterialRef.current.emissiveIntensity = 0.15 + pulseVal * 0.25;
    }

    // Orbital angle theta starting at 0 (Right side of outer ring) -> 2π (360° full orbit)
    const theta = progress * Math.PI * 2;
    const tiltX = 0.4;

    if (kikiGroupRef.current) {
      const rawX = Math.cos(theta) * outerRadiusX;
      const rawZ = Math.sin(theta) * outerRadiusY;

      const vec = new THREE.Vector3(rawX, 0, rawZ);
      vec.applyEuler(new THREE.Euler(tiltX, 0, 0));

      kikiGroupRef.current.position.copy(vec);
      kikiGroupRef.current.rotation.y = -theta + Math.PI / 2;
    }

    // Complete 1 Full Revolution on Outer Ring at 3.0s
    if (progress >= 1.0 && !reachedFrontRef.current) {
      reachedFrontRef.current = true;
      setIsWinking(true);
      setIsShimmering(true);
      setDnaPulse(true);
      onFrontCenterReached();

      // Pause 0.8s on outer ring before transition to /login
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
      {/* 1. HDR Environment Reflections & Specular Lighting */}
      <Environment preset="city" />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 7, 5]} intensity={1.5} />
      <pointLight position={[-5, 3, -4]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, -3, 3]} intensity={0.4} color="#fef08a" />

      {/* 2. Slowly Rotating 3D Liquid Chrome DNA Helix Sculpture (Independent of mouse movement) */}
      <DNAHelix pulse={dnaPulse} position={[0, 0, -1.8]} scale={0.72} />

      {/* 3. Microscopic Crystal Particles (Fluid Air Flow Cursor Interaction Only) */}
      <SpaceParticles count={1000} />

      {/* 4. 5 3D Liquid Chrome Torus Orbit Rings (z = -0.15) */}
      <OrbitRings radiusX={radiusX} radiusY={radiusY} />

      {/* 5. FUTURIL 3D Text Mesh (Real 3D Object at z = 0 with Chrome Finish) */}
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
            color="#ffffff"
            metalness={0.92}
            roughness={0.06}
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

      {/* 6. Kiki 3D Mascot Mesh */}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#070709] text-[#f8fafc] overflow-hidden select-none"
        >
          {/* Subtle Specular Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none" />

          {/* Centered Viewport Container */}
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
