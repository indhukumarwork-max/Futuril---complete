// src/lib/supabase/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from './server';

/**
 * Simple auth middleware for API routes.
 * Reads the Authorization header, verifies the JWT via Supabase admin client,
 * and attaches the user payload to the request (req as any).auth.
 */
export async function authMiddleware(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.next(); // No token – let route handle 401 if needed
  }
  const token = authHeader.split(' ')[1];
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    // Invalid token – respond with 401 immediately
    return new NextResponse(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }
  // Attach minimal auth info to the request for downstream handlers
  (req as any).auth = {
    uid: data.user.id,
    email: data.user.email,
    role: data.user.role,
    exp: data.session?.expires_at,
  };
  return NextResponse.next();
}
