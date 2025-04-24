import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = () => {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: { expires?: Date; path?: string; sameSite?: 'lax' | 'strict' | 'none'; domain?: string }) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: { expires?: Date; path?: string; sameSite?: 'lax' | 'strict' | 'none'; domain?: string }) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
} 