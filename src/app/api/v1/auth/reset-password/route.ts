import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
    redirectTo: process.env.NEXT_PUBLIC_PASSWORD_RESET_REDIRECT || 'http://localhost:3000/reset-complete',
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ message: 'Password reset email sent' });
}
