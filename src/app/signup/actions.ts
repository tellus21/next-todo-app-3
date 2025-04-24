'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
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

  // パスワードの長さチェック
  if (password.length < 8) {
    return {
      error: 'パスワードは8文字以上で入力してください'
    }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    }
  })

  if (error) {
    return {
      error: error.message
    }
  }

  revalidatePath('/', 'layout')
  return {
    success: '確認メールを送信しました。メールをご確認ください。'
  }
} 