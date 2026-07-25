// src/app/api/v1/auth/me/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // The auth middleware attaches auth info to the request object
  const auth = (request as any).auth;
  if (!auth) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }
  return NextResponse.json({ user: { id: auth.uid, email: auth.email, role: auth.role } });
}
