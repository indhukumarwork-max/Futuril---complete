'use client';

import React from 'react';

interface PearlSilverMaterialProps {
  shimmer?: boolean;
}

/** Pearl Silver material per Futuril mascot design spec */
export default function PearlSilverMaterial({ shimmer = false }: PearlSilverMaterialProps) {
  return (
    <meshPhysicalMaterial
      color="#cbd5e1"
      metalness={0.5}
      roughness={0.25}
      clearcoat={0.8}
      clearcoatRoughness={0.15}
      sheen={0.4}
      sheenColor="#f8fafc"
      emissive={shimmer ? '#e2e8f0' : '#000000'}
      emissiveIntensity={shimmer ? 0.3 : 0}
    />
  );
}
