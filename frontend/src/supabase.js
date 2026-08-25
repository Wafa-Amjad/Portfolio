import { createClient } from '@supabase/supabase-js';

// Load Supabase URL and Anon Key from Vite Environment variables (.env file)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient = null;

if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase frontend client successfully initialized.');
} else {
    console.warn('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY are missing in frontend environment. Falling back to API credentials mode.');
}

export const supabase = supabaseClient;
