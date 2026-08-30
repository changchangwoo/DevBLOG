"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "./Badge";
import PostCard from "./PostCard";
import { getCategoryInfo } from "@/lib/category";
import { filterPosts } from "@/lib/filter";
import type { SearchIndex } from "@/app/search-index.json/route";
import Divider from "./Divider";
import { headerConfig } from "./Header/config";

interface SearchModalProps {
  onClose: () => void;
}

const EMPTY_INDEX: SearchIndex = { posts: [], categories: [], tags: [] };

/**
 * 모달은 닫힐 때 언마운트되므로, 컴포넌트 안에서 fetch하면 열 때마다 다시 받는다.
 * 모듈 스코프에 약속을 보관해 페이지당 한 번만 내려받는다.
 */
let indexRequest: Promise<SearchIndex> | null = null;

function loadSearchIndex(): Promise<SearchIndex> {
  indexRequest ??= fetch("/search-index.json")
    .then((res) => {
      if (!res.ok) throw new Error(`검색 인덱스 응답 오류: ${res.status}`);
      return res.json() as Promise<SearchIndex>;
    })
    .catch((error) => {
      indexRequest = null; // 실패는 캐시하지 않는다 (다음 열 때 재시도)
      throw error;
    });

  return indexRequest;
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { logo, siteTitle } = headerConfig;

  // 검색 인덱스는 모달이 처음 열릴 때 한 번만 내려받는다.
  useEffect(() => {
    let active = true;

    loadSearchIndex()
      .then((data) => {
        if (active) setIndex(data);
      })
      .catch((error) => {
        console.error(error);
        if (active) setHasError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const { posts, categories, tags } = index ?? EMPTY_INDEX;

  const filteredPosts = useMemo(() => {
    const query = debouncedSearchQuery.trim();
    if (!query) return [];
    return filterPosts(posts, { search: query });
  }, [posts, debouncedSearchQuery]);

  const handleBadgeClick = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="fixed inset-0 bg-background w-full h-full z-50 overflow-y-auto">
      <div
        className="relative bg-background mx-auto max-w-7xl
      flex flex-col gap-[2rem] px-[2rem] min-h-full pb-[4rem]"
      >
        <header className="relative min-h-[5.4rem] flex justify-center items-center py-[2rem]">
          <Link
            href="/"
            className={`flex items-center gap-2  hover:bg-background-hover rounded-[8px] bg-background`}
          >
            <Image
              src={logo.light}
              alt={siteTitle}
              width={40}
              height={40}
              className="block dark:hidden"
            />
            <Image
              src={logo.dark}
              alt={siteTitle}
              width={40}
              height={40}
              className="hidden dark:block"
            />
          </Link>

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
          <form onSubmit={(e) => e.preventDefault()} className="relative">
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
        </div>

        {hasError && (
          <p className="body3 text-descript">
            검색 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const categoryInfo = getCategoryInfo(category.name);
            return (
              <button
                key={category.name}
                onClick={() => handleBadgeClick(categoryInfo.label)}
              >
                <Badge variant="category" colorClass={categoryInfo.colorClass}>
                  {categoryInfo.label} ({category.count})
                </Badge>
              </button>
            );
          })}
          {tags.map((tag) => (
            <button key={tag.name} onClick={() => handleBadgeClick(tag.name)}>
              <Badge>
                {tag.name} ({tag.count})
              </Badge>
            </button>
          ))}
        </div>

        {debouncedSearchQuery && (
          <div>
            <Divider spacing="md" />
            <p className="body3 text-descript flex gap-[0.4rem]  mt-[1rem] mb-[2rem]">
              포스트
              <span className="text-primary font-bold">
                {filteredPosts.length}건
              </span>
              발견! 👀
            </p>
            <section className="ut-grid">
              {filteredPosts.map((post) => (
                <div key={post.slug} onClick={onClose}>
                  <PostCard post={post} />
                </div>
              ))}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
