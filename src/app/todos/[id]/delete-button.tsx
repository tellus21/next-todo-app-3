"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface DeleteTodoButtonProps {
  id: string;
}

export function DeleteTodoButton({ id }: DeleteTodoButtonProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isConfirming, setIsConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  // 削除処理
  async function handleDelete() {
    setLoading(true);

    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;

      router.push("/todos");
      router.refresh();
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("削除に失敗しました");
      setIsConfirming(false);
    } finally {
      setLoading(false);
    }
  }

  // キャンセル処理
  function handleCancel() {
    setIsConfirming(false);
  }

  if (isConfirming) {
    return (
      <div className="flex space-x-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:bg-red-300"
        >
          {loading ? "削除中..." : "削除する"}
        </button>

        <button
          onClick={handleCancel}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:bg-gray-100"
        >
          キャンセル
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsConfirming(true)}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
    >
      削除
    </button>
  );
}
