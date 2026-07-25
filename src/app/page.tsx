'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/src/components/splash/SplashScreen';

export default function RootPage() {
  const router = useRouter();
  const [shouldRenderSplash, setShouldRenderSplash] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if splash screen was already seen in current browser session
    const splashSeen = sessionStorage.getItem('futuril_splash_seen');
    if (splashSeen === 'true') {
      setShouldRenderSplash(false);
      router.replace('/login');
    } else {
      setShouldRenderSplash(true);
    }
  }, [router]);

  // Prevent flash during initial hydration check
  if (shouldRenderSplash === null) {
    return (
      <main className="fixed inset-0 bg-[#090d16] flex items-center justify-center text-[#f8fafc]" />
    );
  }

  if (!shouldRenderSplash) {
    return (
      <main className="fixed inset-0 bg-[#090d16] flex items-center justify-center text-[#f8fafc]">
        <div className="text-sm text-secondary">Redirecting to Authentication...</div>
      </main>
    );
  }

  return <SplashScreen />;
}
