import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import TodoList from "@/components/TodoList";
import TodoFilters from "@/components/TodoFilters";

interface SearchParams {
  status?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export default async function TodosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
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

  // クエリパラメータから検索条件を取得（searchParamsはPromiseとして処理します）
  const currSearchParams = await searchParams;
  const status = currSearchParams.status;
  const sort = currSearchParams.sort || "created_at";
  const order = currSearchParams.order || "desc";

  // TODOの取得
  let query = supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id)
    .order(sort, { ascending: order === "asc" });

  // ステータスでフィルタリング
  if (status && ["完了", "途中", "未完了"].includes(status)) {
    query = query.eq("status", status);
  }

  const { data: todos } = await query;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">TODOリスト</h1>
        <Link
          href="/todos/create"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          新規作成
        </Link>
      </div>

      <TodoFilters
        currentStatus={status}
        currentSort={sort}
        currentOrder={order}
      />

      <TodoList todos={todos || []} />
    </div>
  );
}
