import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { DeleteTodoButton } from "./delete-button";
import CommentSection from "./comment-section";

interface TodoDetailPageProps {
  params: {
    id: string;
  };
}

export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
  const supabase = await createClient();

  // ユーザー情報の取得
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // ユーザーが認証されていない場合はログインページにリダイレクト
  if (userError || !user) {
    redirect("/signin");
  }

  // TODOの取得
  const { data: todo, error: todoError } = await supabase
    .from("todos")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  // TODOが見つからない場合は404ページを表示
  if (todoError || !todo) {
    notFound();
  }

  // ステータスに対応する色を返す関数
  function getStatusColor(status: string) {
    switch (status) {
      case "完了":
        return "bg-green-100 text-green-800 border-green-200";
      case "途中":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "未完了":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/todos"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            TODOリストに戻る
          </Link>

          <div className="flex space-x-2">
            <Link
              href={`/todos/${todo.id}/edit`}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              編集
            </Link>

            <DeleteTodoButton id={todo.id} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold break-words">{todo.title}</h1>
            <span
              className={`text-sm px-3 py-1 rounded-full ${getStatusColor(
                todo.status
              )} border`}
            >
              {todo.status}
            </span>
          </div>

          {todo.content && (
            <div className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 mb-2">内容</h2>
              <p className="whitespace-pre-wrap break-words">{todo.content}</p>
            </div>
          )}

          <div className="flex justify-between text-sm text-gray-500">
            <div>
              <span className="block">
                作成日時: {new Date(todo.created_at).toLocaleString("ja-JP")}
              </span>
              <span className="block">
                更新日時: {new Date(todo.updated_at).toLocaleString("ja-JP")}
              </span>
            </div>
          </div>
        </div>

        <CommentSection todoId={todo.id} />
      </div>
    </div>
  );
}
