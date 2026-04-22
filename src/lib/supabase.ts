import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing in .env')
}

/**
 * Standard Supabase client for public/anon access.
 */
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')

/**
 * Creates a Supabase client that uses the Clerk session token for RLS.
 * @param getToken Function from Clerk's useSession() or useAuth() to get the JWT
 */
export function createClerkSupabaseClient(getToken: (options?: { template?: string }) => Promise<string | null>) {
  return createClient(supabaseUrl || '', supabaseAnonKey || '', {
    global: {
      fetch: async (url, options = {}) => {
        const token = await getToken({ template: 'supabase' })
        const headers = new Headers(options.headers)
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
        return fetch(url, { ...options, headers })
      },
    },
  })
}
