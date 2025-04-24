"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { updateTodo } from "./actions";

interface EditTodoPageProps {
  params: {
    id: string;
  };
}

export default function EditTodoPage({ params }: EditTodoPageProps) {
  const router = useRouter();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [todo, setTodo] = useState<{
    title: string;
    content: string | null;
    status: "完了" | "途中" | "未完了";
  } | null>(null);

  // TODOデータの取得
  useEffect(() => {
    async function fetchTodo() {
      setFetchLoading(true);

      try {
        // ユーザー情報の取得
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError || !userData.user) {
          router.push("/signin");
          return;
        }

        // TODOの取得
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", userData.user.id)
          .single();

        if (error || !data) {
          router.push("/todos");
          return;
        }

        setTodo({
          title: data.title,
          content: data.content,
          status: data.status,
        });
      } catch (error) {
        console.error("Error fetching todo:", error);
        router.push("/todos");
      } finally {
        setFetchLoading(false);
      }
    }

    fetchTodo();
  }, [supabase, params.id, router]);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await updateTodo(params.id, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-500">TODOが見つかりませんでした</p>
          <Link
            href="/todos"
            className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            TODOリストに戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">TODO編集</h1>
          <Link
            href={`/todos/${params.id}`}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            キャンセル
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form
          action={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              maxLength={50}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="TODOのタイトルを入力（50文字以内）"
              defaultValue={todo.title}
            />
            <p className="text-xs text-gray-500 mt-1">
              50文字以内で入力してください
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              内容
            </label>
            <textarea
              id="content"
              name="content"
              maxLength={100}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="TODOの詳細を入力（任意、100文字以内）"
              defaultValue={todo.content || ""}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              100文字以内で入力してください
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ステータス
            </label>
            <select
              id="status"
              name="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={todo.status}
            >
              <option value="未完了">未完了</option>
              <option value="途中">途中</option>
              <option value="完了">完了</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium 
              ${loading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"} 
              transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            {loading ? "更新中..." : "TODOを更新"}
          </button>
        </form>
      </div>
    </div>
  );
}
