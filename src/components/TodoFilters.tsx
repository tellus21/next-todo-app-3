"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TodoFiltersProps {
  currentStatus?: string;
  currentSort?: string;
  currentOrder?: string;
}

export default function TodoFilters({
  currentStatus,
  currentSort = "created_at",
  currentOrder = "desc",
}: TodoFiltersProps) {
  const pathname = usePathname();

  // 現在の状態を保持しながらパラメータを更新してURLを生成する関数
  function generateUrl(params: Record<string, string | undefined>) {
    const newParams = new URLSearchParams();

    // 現在のパラメータをコピー
    if (currentStatus) newParams.set("status", currentStatus);
    if (currentSort) newParams.set("sort", currentSort);
    if (currentOrder) newParams.set("order", currentOrder);

    // 新しいパラメータで上書き
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    return `${pathname}?${newParams.toString()}`;
  }

  const statusOptions = [
    { value: undefined, label: "すべて" },
    { value: "未完了", label: "未完了" },
    { value: "途中", label: "途中" },
    { value: "完了", label: "完了" },
  ];

  const sortOptions = [
    { value: "created_at", label: "作成日" },
    { value: "updated_at", label: "更新日" },
    { value: "title", label: "タイトル" },
  ];

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ステータス
          </label>
          <div className="flex space-x-1">
            {statusOptions.map((option) => (
              <Link
                key={option.label}
                href={generateUrl({ status: option.value })}
                className={`px-3 py-1 text-sm rounded-md 
                  ${
                    currentStatus === option.value ||
                    (!currentStatus && option.value === undefined)
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            並び替え
          </label>
          <div className="flex space-x-1">
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={generateUrl({ sort: option.value })}
                className={`px-3 py-1 text-sm rounded-md 
                  ${
                    currentSort === option.value
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {option.label}
              </Link>
            ))}

            <Link
              href={generateUrl({
                order: currentOrder === "asc" ? "desc" : "asc",
              })}
              className="px-3 py-1 text-sm rounded-md bg-white text-gray-700 hover:bg-gray-100"
            >
              {currentOrder === "asc" ? "▲ 昇順" : "▼ 降順"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
