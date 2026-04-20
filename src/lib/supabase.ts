import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePupblishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePupblishableKey) {
  console.warn('Supabase credentials missing in .env')
}

export const supabase = createClient(supabaseUrl || '', supabasePupblishableKey || '')
