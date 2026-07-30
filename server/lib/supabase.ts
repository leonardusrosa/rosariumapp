import { createClient } from '@supabase/supabase-js'

// Load .env variables
try { process.loadEnvFile(); } catch {}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseAvailable = () => !!(supabaseUrl && supabaseKey);

if (!isSupabaseAvailable()) {
  console.warn('⚠️ Supabase environment variables missing. Falling back to memory storage for preview.');
} else {
  console.log('✅ Supabase environment variables loaded successfully.');
}

export const supabase = isSupabaseAvailable()
  ? createClient(supabaseUrl!, supabaseKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
