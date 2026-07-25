import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-bg">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-ink">Welcome to Futuril</h1>
        <p className="text-lg text-secondary">
          Select a test view to inspect application features and components:
        </p>
        <div className="flex flex-col space-y-3 pt-4">
          <Link
            href="/primitives"
            className="w-full px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent-tint transition-colors shadow-sm"
          >
            UI Primitives Demo (`/primitives`)
          </Link>
          <Link
            href="/kiki-test"
            className="w-full px-6 py-3 bg-surface border border-border text-ink font-medium rounded-lg hover:bg-surface-2 transition-colors shadow-sm"
          >
            Kiki 3D Component Test (`/kiki-test`)
          </Link>
        </div>
      </div>
    </main>
  );
}
