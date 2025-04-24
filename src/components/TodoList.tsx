"use client";

import Link from "next/link";

export interface Todo {
  id: string;
  title: string;
  content: string | null;
  status: "完了" | "途中" | "未完了";
  created_at: string;
  updated_at: string;
}

interface TodoListProps {
  todos: Todo[];
}

// ステータスに対応する色を返す関数
function getStatusColor(status: Todo["status"]) {
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

export default function TodoList({ todos }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-500">TODOがありません</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {todos.map((todo) => (
        <Link href={`/todos/${todo.id}`} key={todo.id} className="block">
          <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg truncate">{todo.title}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                  todo.status
                )} border`}
              >
                {todo.status}
              </span>
            </div>

            {todo.content && (
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {todo.content}
              </p>
            )}

            <div className="text-xs text-gray-500 flex justify-between">
              <span>
                作成: {new Date(todo.created_at).toLocaleDateString("ja-JP")}
              </span>
              <span>
                更新: {new Date(todo.updated_at).toLocaleDateString("ja-JP")}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
