'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface OrbitRingsProps {
  radiusX?: number;
  radiusY?: number;
}

/**
 * 5 Ultra-Thin Smooth 360° Elliptical Orbit Rings
 * Built with THREE.EllipseCurve and THREE.LineLoop for pristine 360° vector geometry inside WebGL space.
 * Layered behind central text (z = -0.15).
 */
export default function OrbitRings({
  radiusX = 1.6,
  radiusY = 0.75,
}: OrbitRingsProps) {
  const ringGeometries = useMemo(() => {
    const scaleY = radiusY / radiusX;
    const configs = [
      { rx: radiusX * 0.85, opacity: 0.14 },
      { rx: radiusX * 1.0, opacity: 0.2 },
      { rx: radiusX * 1.18, opacity: 0.25 },
      { rx: radiusX * 1.35, opacity: 0.32 },
      { rx: radiusX * 1.52, opacity: 0.5 }, // Outermost primary trajectory ring
    ];

    return configs.map((ring) => {
      const curve = new THREE.EllipseCurve(
        0, 0,
        ring.rx, ring.rx * scaleY,
        0, Math.PI * 2,
        false,
        0
      );
      const points = curve.getPoints(128);
      const geo = new THREE.BufferGeometry().setFromPoints(
        points.map((p) => new THREE.Vector3(p.x, p.y, 0))
      );
      return { geo, opacity: ring.opacity };
    });
  }, [radiusX, radiusY]);

  return (
    <group position={[0, 0, -0.15]} rotation={[0.4, 0, 0]}>
      {ringGeometries.map((ring, idx) => (
        <lineLoop key={idx} geometry={ring.geo}>
          <lineBasicMaterial
            color="#e2e8f0"
            transparent
            opacity={ring.opacity}
            depthWrite={true}
            depthTest={true}
          />
        </lineLoop>
      ))}
    </group>
  );
}
