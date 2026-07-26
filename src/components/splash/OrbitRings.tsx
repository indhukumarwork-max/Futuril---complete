'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface OrbitRingsProps {
  radiusX?: number;
  radiusY?: number;
}

/**
 * 5 3D Liquid Chrome Orbit Ring Toruses
 * Built with 3D torus geometries and physically-based chrome materials for metallic reflections.
 * Layered behind central wordmark (z = -0.15).
 */
export default function OrbitRings({
  radiusX = 1.6,
  radiusY = 0.75,
}: OrbitRingsProps) {
  const rings = useMemo(() => {
    const scaleY = radiusY / radiusX;
    const configs = [
      { rx: radiusX * 0.85, opacity: 0.35, tube: 0.006 },
      { rx: radiusX * 1.0, opacity: 0.45, tube: 0.007 },
      { rx: radiusX * 1.18, opacity: 0.55, tube: 0.008 },
      { rx: radiusX * 1.35, opacity: 0.65, tube: 0.009 },
      { rx: radiusX * 1.52, opacity: 0.85, tube: 0.011 }, // Outermost primary trajectory ring
    ];

    return configs.map((cfg) => ({
      radius: cfg.rx,
      scaleY,
      tube: cfg.tube,
      opacity: cfg.opacity,
    }));
  }, [radiusX, radiusY]);

  return (
    <group position={[0, 0, -0.15]} rotation={[0.4, 0, 0]}>
      {rings.map((ring, idx) => (
        <group key={idx} scale={[1, ring.scaleY, 1]}>
          <mesh>
            <torusGeometry args={[ring.radius, ring.tube, 16, 128]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0.92}
              roughness={0.08}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              reflectivity={1.0}
              emissive="#e2e8f0"
              emissiveIntensity={0.15}
              transparent
              opacity={ring.opacity}
              depthWrite={true}
              depthTest={true}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
