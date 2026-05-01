import { createClient as createBrowserClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (!client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!supabaseUrl || !supabaseKey) {
      return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
    }
    client = createBrowserClient(supabaseUrl, supabaseKey)
  }
  return client
}
