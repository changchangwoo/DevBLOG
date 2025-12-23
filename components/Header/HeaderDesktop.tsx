"use client";

import Link from "next/link";
import Image from "next/image";

interface HeaderDesktopProps {
  isScrolled: boolean;
  mounted: boolean;
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

export default function HeaderDesktop({
  isScrolled,
  mounted,
  theme,
  setTheme,
}: HeaderDesktopProps) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 max-h-[3.4rem] hidden xl:block ${
        isScrolled
          ? "bg-white/95 dark:bg-zinc-900/95 shadow-md backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-4xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`flex items-center gap-2 ${
              isScrolled
                ? "text-zinc-900 dark:text-zinc-50"
                : "text-zinc-900 dark:text-zinc-50"
            }`}
          >
            <Image
              src="/images/common/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="transition-opacity hover:opacity-80"
            />
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/post"
              className={`text-sm font-medium  hover:text-blue-600 dark:hover:text-blue-400 ${
                isScrolled
                  ? "text-zinc-700 dark:text-zinc-300"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              포스트
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium  hover:text-blue-600 dark:hover:text-blue-400 ${
                isScrolled
                  ? "text-zinc-700 dark:text-zinc-300"
                  : "text-zinc-700 dark:text-zinc-300"
              }`}
            >
              소개
            </Link>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`rounded-lg p-2  hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
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
