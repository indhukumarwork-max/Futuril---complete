'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Card } from '@/src/components/ui/card';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import DNAHelix from '@/src/components/3d/DNAHelix';
import SpaceParticles from '@/src/components/splash/SpaceParticles';

/**
 * 3D Background Scene for Login Screen
 * DNA model is a permanent luxury sculpture (100% independent of mouse movement).
 * Particles react to air movement of the cursor.
 */
function Login3DBackground() {
  return (
    <group>
      <Environment preset="city" />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 7, 5]} intensity={1.3} />
      <pointLight position={[-4, 3, -3]} intensity={0.5} color="#ffffff" />

      {/* Slowly Rotating Liquid Chrome DNA Helix Sculpture (Subtly dimmed background, zero mouse tracking) */}
      <DNAHelix dimmed={true} position={[-2.2, 0, -2.5]} scale={1.1} />

      {/* Microscopic Crystal Particles (React to air flow of cursor) */}
      <SpaceParticles count={1000} />
    </group>
  );
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Client-side email format validator per spec
  const validateEmail = (val: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    setEmailError('');

    // 1. Client-side email format check
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setServerError('Password is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Consume Auth Endpoint: POST /api/v1/auth/login
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle 429 Rate Limiting per spec
        if (res.status === 429) {
          setServerError(data.error || 'Too many login attempts. Try again later.');
        } else {
          // Surface generic server error per docs/auth-flow.md
          setServerError('Invalid email or password');
        }
        setIsSubmitting(false);
        return;
      }

      // Successful login
      setLoginSuccess(true);
      if (data.access_token && typeof window !== 'undefined') {
        localStorage.setItem('futuril_token', data.access_token);
      }

      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (err) {
      setServerError('Network error. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/v1/auth/login?provider=${provider}`;
  };

  return (
    <main className="min-h-screen bg-[#070709] flex items-center justify-center p-4 text-white select-none relative overflow-hidden">
      {/* 1. Real-time 3D DNA Environment Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5.2], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <Login3DBackground />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. Ambient Glass Lighting Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_75%)] pointer-events-none z-0" />

      {/* 3. Floating Spatial Frosted Glass Login Card */}
      <div className="w-full max-w-md space-y-6 relative z-10 my-8">
        <Card className="space-y-6">
          {/* Header & Futuril Logo */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold tracking-widest text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              FUTURIL
            </h1>
            <p className="text-xs tracking-wider uppercase text-zinc-400 font-medium">
              Sign in to your account
            </p>
          </div>

          {/* Success Banner */}
          {loginSuccess && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-300 text-sm font-medium text-center backdrop-blur-xl">
              Login successful! Redirecting...
            </div>
          )}

          {/* Generic Server Error Banner / Rate Limiting Alert */}
          {serverError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-sm font-medium text-center backdrop-blur-xl">
              {serverError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Field */}
            <div className="space-y-2 text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 pl-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                error={!!emailError}
                disabled={isSubmitting}
                autoComplete="email"
              />
              {emailError && (
                <p className="text-xs text-red-400 mt-1.5 pl-1 font-medium">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between pl-1 pr-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Password
                </label>
                <a
                  href="/reset-password"
                  className="text-xs text-zinc-300 hover:text-white transition-colors font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (serverError) setServerError('');
                }}
                disabled={isSubmitting}
                autoComplete="current-password"
              />
            </div>

            {/* Primary Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 py-3.5 text-sm tracking-wide font-semibold hover:-translate-y-0.5 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="animate-spin h-4 w-4 text-zinc-950"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-3 bg-[#0c0d12]/90 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
              or continue with
            </span>
          </div>

          {/* Premium Branded OAuth Buttons (Google, GitHub, Microsoft) */}
          <div className="space-y-3">
            {/* Google */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('google')}
              className="w-full py-3 flex items-center justify-center space-x-3 hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.3-.7-.4-1.5-.4-2.3z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span className="text-xs font-medium">Continue with Google</span>
            </Button>

            {/* GitHub */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('github')}
              className="w-full py-3 flex items-center justify-center space-x-3 hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="text-xs font-medium">Continue with GitHub</span>
            </Button>

            {/* Microsoft */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin('microsoft')}
              className="w-full py-3 flex items-center justify-center space-x-3 hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-4 h-4" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              <span className="text-xs font-medium">Continue with Microsoft</span>
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
