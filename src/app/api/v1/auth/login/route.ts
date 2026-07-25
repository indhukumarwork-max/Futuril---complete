// src/app/api/v1/auth/login/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabase/server';
import { checkRateLimit, resetRateLimit } from '@/src/lib/auth/rateLimiter';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many login attempts. Try again later.' }, { status: 429 });
  }

  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  // Successful login – reset rate limit for this IP
  resetRateLimit(ip);

  const { user, session } = data;
  return NextResponse.json({
    user: { id: user.id, email: user.email, role: user.role },
    access_token: session?.access_token,
    refresh_token: session?.refresh_token,
    expires_in: session?.expires_in,
  });
}
