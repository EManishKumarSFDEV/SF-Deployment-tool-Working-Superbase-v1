import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  supabase = null;
}

export { supabase };