"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTodo } from "./actions";

type Todo = {
  id: string;
  title: string;
  content: string | null;
  status: "完了" | "途中" | "未完了";
  user_id: string;
  created_at: string;
};

interface EditTodoFormProps {
  todo: Todo;
  todoId: string;
}

export default function EditTodoForm({ todo, todoId }: EditTodoFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await updateTodo(todoId, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push(`/todos/${todoId}`);
    router.refresh();
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
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
    </>
  );
}
