import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next.js TODOアプリ",
  description: "Next.js、TypeScript、Supabase、TailwindCSSで作られたTODOアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              TODOアプリ
            </Link>
            <nav>
              <ul className="flex space-x-4">
                <li>
                  <Link
                    href="/todos"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    TODOリスト
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mypage"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    マイページ
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-white mt-12 py-6 border-t">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Next.js TODOアプリ
          </div>
        </footer>
      </body>
    </html>
  );
}
