import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://prtxsvgpjpgzzoxyhmrf.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydHhzdmdwanBnenpveHlobXJmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTQ3NzM4MCwiZXhwIjoyMDY3MDUzMzgwfQ.X504k02T6UnClUe09IZW5JFWTmVRvwRV-y44Rk_me1s'

// Always create supabase client for server
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Function to check if Supabase is available - always true now
export const isSupabaseAvailable = () => true