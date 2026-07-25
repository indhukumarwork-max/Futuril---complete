'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Kiki = dynamic(() => import('@/src/components/kiki/Kiki'), { ssr: false });

export default function KikiTestPage() {
  return (
    <main className="w-screen h-screen bg-slate-900 flex flex-col items-center justify-center">
      <h1 className="text-white text-xl font-bold py-4 z-10">Kiki 3D Component Test (sm, md, lg)</h1>
      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 1, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            {/* Render three size variants side by side */}
            <group position={[-2.5, 0, 0]}>
              <Kiki size="sm" state="idle" />
            </group>
            <group position={[0, 0, 0]}>
              <Kiki size="md" state="idle" />
            </group>
            <group position={[2.5, 0, 0]}>
              <Kiki size="lg" state="idle" />
            </group>
          </Suspense>
        </Canvas>
      </div>
    </main>
  );
}
