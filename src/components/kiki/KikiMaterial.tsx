'use client';

/** Pearl Silver material per UI design spec */
export default function PearlSilverMaterial() {
  return (
    <meshPhysicalMaterial
      color="#e2e8f0"
      metalness={0.4}
      roughness={0.35}
      clearcoat={0.6}
      clearcoatRoughness={0.2}
      sheen={0.3}
    />
  );
}
