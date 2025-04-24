import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // ユーザー情報の取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ログイン済みの場合はTODOリストにリダイレクト
  if (user) {
    redirect("/todos");
  }

  // 未ログインの場合はログインページにリダイレクト
  redirect("/signin");
}
