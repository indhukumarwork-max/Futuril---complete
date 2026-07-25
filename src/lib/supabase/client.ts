// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

// Public anon client – used on the client side (if needed) and for auth actions that do not require admin privileges.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
