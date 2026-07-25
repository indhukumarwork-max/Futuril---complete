'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 text-[#f8fafc]">
      <Card className="max-w-md w-full p-8 bg-[#0f172a] border border-[#1e293b] text-center space-y-6 shadow-2xl rounded-2xl">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-widest text-[#f8fafc]">FUTURIL</h1>
          <p className="text-xs tracking-wider uppercase text-[#64748b]">Brand Entry Experience</p>
        </div>

        <div className="py-6 border-y border-[#1e293b]">
          <Badge variant="primary" className="mb-3 px-3 py-1 text-xs">
            Phase 1.1 Complete
          </Badge>
          <p className="text-sm text-[#cbd5e1] font-medium">
            Login Screen Coming in Phase 1.2
          </p>
        </div>

        <button
          onClick={() => {
            sessionStorage.removeItem('futuril_splash_seen');
            window.location.href = '/';
          }}
          className="text-xs text-[#94a3b8] hover:text-[#f8fafc] underline transition-colors"
        >
          Replay Splash Screen
        </button>
      </Card>
    </main>
  );
}
