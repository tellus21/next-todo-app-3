"use client";

import { useParams } from "next/navigation";
import EditTodoForm from "./EditTodoForm";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Todo = {
  id: string;
  title: string;
  content: string | null;
  status: "完了" | "途中" | "未完了";
  user_id: string;
  created_at: string;
};

export default function EditTodoPage() {
  const params = useParams<{ id: string }>();
  const supabase = createClient();
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodo() {
      try {
        // ユーザー情報の取得
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError || !userData.user) {
          setError("ログインが必要です");
          setLoading(false);
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
          setError("TODOが見つかりませんでした");
          setLoading(false);
          return;
        }

        setTodo(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // エラーをキャッチしても何もしない
        setError("エラーが発生しました");
      } finally {
        setLoading(false);
      }
    }

    fetchTodo();
  }, [params.id, supabase]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-red-500">
            {error || "TODOが見つかりませんでした"}
          </p>
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

        <EditTodoForm todo={todo} todoId={params.id} />
      </div>
    </div>
  );
}
