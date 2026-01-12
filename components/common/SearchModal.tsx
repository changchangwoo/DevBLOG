"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Badge from "./Badge";
import PostCard from "./PostCard";
import { getCategoryInfo } from "@/lib/category";
import { filterPosts } from "@/lib/filter";
import type { PostPreview, Tag, Category } from "@/lib/posts";
import Divider from "./Divider";

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
  categories: Category[];
  tags: Tag[];
  posts: PostPreview[];
}

export default function SearchModal({
  isOpen,
  onClose,
  theme,
  config,
  categories,
  tags,
  posts,
}: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredPosts = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return [];
    return filterPosts(posts, { search: debouncedSearchQuery.trim() });
  }, [posts, debouncedSearchQuery]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

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

  const handleBadgeClick = (value: string) => {
    setSearchQuery(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bg-background w-full h-full z-50">
      <div
        className="relative bg-background mx-auto max-w-7xl
      flex flex-col gap-[2rem] px-[2rem] gap-["
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
        </div>
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
              <Badge>{tag.name} ({tag.count})</Badge>
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
