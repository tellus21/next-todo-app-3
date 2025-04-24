'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signin(formData: FormData) {
  const supabase = await createClient()
  
  // 入力値の取得
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 実際のアプリケーションでは、ここでzodなどを使って入力値バリデーションを行うべきです
  if (!email || !password) {
    return {
      error: 'メールアドレスとパスワードを入力してください'
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message
    }
  }

  revalidatePath('/', 'layout')
  redirect('/todos')
} 