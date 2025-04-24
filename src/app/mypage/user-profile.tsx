"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface ProfileType {
  id: string;
  email?: string;
  name?: string;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

interface Props {
  user: User;
  profile: ProfileType | null;
}

export default function UserProfile({ user, profile }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState(profile?.name || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // プロフィール更新処理
  async function updateProfile() {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("プロフィールの更新に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  // サインアウト処理
  async function handleSignOut() {
    setLoading(true);

    try {
      await fetch("/auth/signout", { method: "POST" });
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">メールアドレス</p>
            <p>{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">ユーザーID</p>
            <p className="text-sm font-mono">{user.id}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">最終ログイン</p>
            <p>
              {profile?.last_login
                ? new Date(profile.last_login).toLocaleString("ja-JP")
                : "情報なし"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">プロフィール情報</h2>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                お名前
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-2">
              <button
                onClick={updateProfile}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {loading ? "保存中..." : "保存する"}
              </button>

              <button
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100"
              >
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">お名前</p>
              <p>{profile?.name || "未設定"}</p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              編集する
            </button>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-red-300"
        >
          {loading ? "ログアウト中..." : "ログアウト"}
        </button>
      </div>
    </div>
  );
}
