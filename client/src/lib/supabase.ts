import { createClient } from '@supabase/supabase-js'

// Use environment variables or fallback to direct values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://prtxsvgpjpgzzoxyhmrf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydHhzdmdwanBnenpveHlobXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NzczODAsImV4cCI6MjA2NzA1MzM4MH0.CQ_Og94SthLg6z1vt-6-QVPyE-9AZgWn5sKUeLAWyb0'

// Always create supabase client - remove guest mode fallback
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Function to check if Supabase is available - always true now
export const isSupabaseAvailable = () => true