// src/middleware.ts
import { authMiddleware } from '@/src/lib/supabase/middleware';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  return authMiddleware(req);
}

export const config = {
  matcher: ['/api/v1/:path*'],
};
