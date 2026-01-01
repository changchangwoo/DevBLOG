"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tags: string[];
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  tags,
}: SearchBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const allTags = ["All", ...tags];

  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        setSearchQuery(localQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localQuery, searchQuery, setSearchQuery]);

  return (
    <div className="mb-[1rem]">
      <div className="relative">
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="포스트 제목, 내용, 태그를 입력해주세요"
          className="body3 w-full rounded-lg border border-boundary px-4 py-3 text-descript placeholder-descript bg-secondary"
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

      {/* <div className="mt-[1rem]">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="transition-opacity hover:opacity-70"
            >
              <Badge active={isActiveTag(tag)}>{tag}</Badge>
            </button>
          ))}
        </div>
      </div> */}
    </div>
  );
}
