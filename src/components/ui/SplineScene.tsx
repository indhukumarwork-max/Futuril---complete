'use client';

import React, { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: (splineApp: any) => void;
}

/**
 * SSR-safe Spline 3D Scene Wrapper for Next.js App Router
 */
export default function SplineScene({ scene, className = '', onLoad }: SplineSceneProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center bg-surface2 text-ink-secondary text-sm rounded-xl">
            Loading 3D Scene...
          </div>
        }
      >
        <Spline scene={scene} onLoad={onLoad} />
      </Suspense>
    </div>
  );
}
