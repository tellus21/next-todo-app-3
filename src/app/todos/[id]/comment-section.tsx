"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

interface CommentSectionProps {
  todoId: string;
}

export default function CommentSection({ todoId }: CommentSectionProps) {
  const router = useRouter();
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // コメントの取得
  useEffect(() => {
    async function fetchComments() {
      setFetchLoading(true);

      try {
        const { data, error } = await supabase
          .from("comments")
          .select("*")
          .eq("todo_id", todoId)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setComments(data || []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setFetchLoading(false);
      }
    }

    fetchComments();

    // リアルタイム購読の設定
    const subscription = supabase
      .channel("comments_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `todo_id=eq.${todoId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, todoId]);

  // コメント追加処理
  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();

    if (!newComment.trim()) return;

    setLoading(true);

    try {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        throw new Error("ユーザー認証に失敗しました");
      }

      const { error } = await supabase.from("comments").insert({
        todo_id: todoId,
        user_id: userData.user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      router.refresh();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("コメントの追加に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  // コメント削除処理
  async function handleDeleteComment(commentId: string) {
    if (!confirm("コメントを削除しますか？")) return;

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      setComments(comments.filter((comment) => comment.id !== commentId));
      router.refresh();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("コメントの削除に失敗しました");
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">コメント</h2>

      <form onSubmit={handleAddComment} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="コメントを入力..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? "送信中..." : "送信"}
          </button>
        </div>
      </form>

      {fetchLoading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">コメントはまだありません</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-start">
                <p className="whitespace-pre-wrap break-words">
                  {comment.content}
                </p>
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-500 hover:text-red-700 text-sm ml-2"
                >
                  削除
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(comment.created_at).toLocaleString("ja-JP")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
