"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 클라이언트 사이드에서만 렌더링 (hydration 불일치 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // 20px 이상 스크롤하면 색상 변경
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-zinc-900/95 shadow-md backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-4xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`text-xl font-bold transition-colors ${
              isScrolled
                ? "text-zinc-900 dark:text-zinc-50"
                : "text-zinc-900 dark:text-zinc-50"
            }`}
          >
            ChangWoo.DEV
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isScrolled
                  ? "text-zinc-700 dark:text-zinc-300"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              블로그
            </Link>
            <Link
              href="/#"
              className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                isScrolled
                  ? "text-zinc-700 dark:text-zinc-300"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              소개
            </Link>

            {/* 다크모드 토글 버튼 */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`rounded-lg p-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  isScrolled
                    ? "text-zinc-700 dark:text-zinc-300"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
                aria-label="테마 전환"
              >
                {theme === "dark" ? (
                  // 다크모드일 때 해 아이콘 (라이트 모드로 전환)
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ) : (
                  // 라이트모드일 때 달 아이콘 (다크 모드로 전환)
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
