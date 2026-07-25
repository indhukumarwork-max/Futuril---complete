import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/src/lib/supabase/server';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
  }
  const token = authHeader.split(' ')[1];
  const { error } = await supabaseAdmin.auth.admin.signOut(token);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
