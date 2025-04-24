import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-3xl font-bold text-red-500">
          エラーが発生しました
        </h1>
        <p className="mt-3 text-lg">
          操作中に問題が発生しました。もう一度お試しいただくか、しばらく経ってからアクセスしてください。
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
