import { createClient } from '@supabase/supabase-js';

// environment variables are prefixed with VITE_ so they are exposed to the browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase client missing URL or anon key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
