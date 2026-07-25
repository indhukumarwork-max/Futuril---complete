import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin.auth.signUp({ email, password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  const { user, session } = data;
  return NextResponse.json({
    user: user ? { id: user.id, email: user.email, confirmed_at: user.confirmed_at } : null,
    access_token: session?.access_token,
    refresh_token: session?.refresh_token,
    expires_in: session?.expires_in,
  });
}
