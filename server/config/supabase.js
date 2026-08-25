import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && (supabaseAnonKey || supabaseServiceKey)) {
    // Use service key if available for system calculations, otherwise anon
    supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
    console.log('Supabase client initialized successfully.');
} else {
    console.warn('Supabase URL or Key not found in environment variables. Falling back to local JSON database mode.');
}

export default supabase;
export { supabaseUrl, supabaseAnonKey };
