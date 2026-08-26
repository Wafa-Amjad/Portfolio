import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && (supabaseAnonKey || supabaseServiceKey)) {
    // Prefer service role key on backend for admin database operations, fallback to anon
    const key = supabaseServiceKey || supabaseAnonKey;
    supabase = createClient(supabaseUrl, key, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        }
    });
    console.log(`[Supabase] Client initialized successfully (${supabaseServiceKey ? 'Service-Role' : 'Anon'} mode).`);
} else {
    console.warn('[Supabase] SUPABASE_URL or keys not configured. Operating in local JSON storage mode.');
}

export default supabase;
export { supabaseUrl, supabaseAnonKey, supabaseServiceKey };
