"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface HeaderMobileProps {
  isScrolled: boolean;
  isVisible: boolean;
  mounted: boolean;
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

export default function HeaderMobile({
  isScrolled,
  isVisible,
  mounted,
  theme,
  setTheme,
}: HeaderMobileProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-background xl:hidden border-b border-boundary transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="px-[2rem] py-[1rem]">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`flex items-center gap-[0.5rem] justify-center ${
              isScrolled ? "text-primary" : "text-background"
            }`}
          >
            <Image
              src="/images/common/logo.svg"
              alt="Logo"
              width={26}
              height={26}
              className="transition-opacity hover:opacity-80"
            />
            <h1 className="body3 text-primary">FE Developer Changwoo</h1>
          </Link>

          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  isScrolled
                    ? "text-zinc-700 dark:text-zinc-300"
                    : "text-zinc-700 dark:text-zinc-300"
                }`}
                aria-label="테마 전환"
              >
                {theme === "dark" ? (
                  <svg
                    className="h-[2.4rem] w-[2.4rem]"
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
                  <svg
                    className="h-[2.4rem] w-[2.4rem]"
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
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {isMenuOpen ? (
                <svg
                  className="h-[2.4rem] w-[2.4rem]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-[2.4rem] w-[2.4rem]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <nav className=" mt-4 pt-4">
            <div className="flex flex-col gap-[2rem]">
              <Link
                href="/about"
                className="body3 text-primary "
                onClick={() => setIsMenuOpen(false)}
              >
                소개
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
