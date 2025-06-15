// This file maintains Supabase client for database operations only (not authentication)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const FALLBACK_MODE = import.meta.env.VITE_FALLBACK_MODE === 'true'

// Note: Supabase is now used ONLY for database operations, not authentication
// Authentication is handled by Firebase

let supabase: any = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Disable Supabase auth since we're using Firebase
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
  console.log('✅ Supabase client initialized for database operations only')
} else {
  console.warn('⚠️ Supabase not configured - database operations will use fallback')
  // Create a basic fallback client for development
  supabase = {
    // Mock database operations if needed
  }
}

export { supabase }
export default supabase