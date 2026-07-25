// src/lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js';

// Service role client – has elevated privileges (e.g., creating users, managing RLS).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
