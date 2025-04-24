'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createTodo(formData: FormData) {
  const supabase = await createClient()
  
  // ユーザー情報の取得
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  // ユーザーが認証されていない場合はエラーを返す
  if (userError || !user) {
    return {
      error: 'ユーザー認証に失敗しました'
    }
  }
  
  // 入力値の取得
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const status = formData.get('status') as '完了' | '途中' | '未完了'
  
  // 入力値のバリデーション
  if (!title) {
    return {
      error: 'タイトルは必須です'
    }
  }
  
  if (title.length > 50) {
    return {
      error: 'タイトルは50文字以内で入力してください'
    }
  }
  
  if (content && content.length > 100) {
    return {
      error: '内容は100文字以内で入力してください'
    }
  }
  
  // TODOの作成
  const { error } = await supabase
    .from('todos')
    .insert({
      user_id: user.id,
      title,
      content: content || null,
      status: status || '未完了',
    })
  
  if (error) {
    console.error('Error creating todo:', error)
    return {
      error: 'TODOの作成に失敗しました'
    }
  }
  
  // キャッシュの再検証
  revalidatePath('/todos')
  
  // TODOリストにリダイレクト
  redirect('/todos')
} 