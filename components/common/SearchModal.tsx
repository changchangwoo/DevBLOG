"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string | undefined;
  config: {
    logo: {
      light: string;
      dark: string;
      alt: string;
      width: number;
      height: number;
    };
    siteTitle: string;
  };
}

export default function SearchModal({
  isOpen,
  onClose,
  theme,
  config,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // 모달 열릴 때 input에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bg-background w-full h-full z-50">
      <div
        className="relative bg-background mx-auto max-w-7xl
      flex flex-col gap-[2rem] px-[2rem]"
      >
        <header className="relative min-h-[5.4rem] flex justify-center items-center py-[2rem]">
          <Link
            href="/"
            className={`flex items-center gap-2  hover:bg-background-hover rounded-[8px] bg-background`}
          >
            <Image
              src={theme === "dark" ? config.logo.dark : config.logo.light}
              alt={config.logo.alt}
              width={40}
              height={40}
            />
          </Link>

          {/* Exit 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-[2.4rem] right-[1rem] p-2 rounded-[8px] hover:bg-background-hover transition-colors cursor-pointer"
            aria-label="검색 닫기"
          >
            <svg
              className="h-[2.4rem] w-[2.4rem] text-primary"
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
          </button>
        </header>

        <div>
          {/* 검색 입력 */}
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="포스트 제목, 내용, 태그를 입력해주세요"
                className="body3 w-full rounded-[8px] border border-boundary px-4 py-5 text-descript placeholder-descript bg-secondary"
              />
              <svg
                className="absolute right-4 top-1/2 h-[2.4rem] w-[2.4rem] -translate-y-1/2 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          {/* 카테고리 리스트 출력되어야하는 부분 */}

          {/* 검색 결과 영역 (나중에 구현) */}
          {searchQuery && (
            <div className="border-t border-boundary p-[2rem]">
              <p className="body3 text-descript text-center">
                &apos;{searchQuery}&apos; TBD
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
