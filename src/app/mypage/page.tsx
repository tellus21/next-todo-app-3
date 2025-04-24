import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UserProfile from "./user-profile";

export default async function MyPage() {
  const supabase = await createClient();

  // ユーザー情報の取得
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // ユーザーが認証されていない場合はログインページにリダイレクト
  if (error || !user) {
    redirect("/signin");
  }

  // プロフィール情報の取得
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">マイページ</h1>
      <UserProfile user={user} profile={profile} />
    </div>
  );
}
