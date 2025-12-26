"use client";

import Badge from "../common/Badge";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tags: string[];
  onTagClick: (tag: string) => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  tags,
  onTagClick,
}: SearchBarProps) {
  const allTags = ["All", ...tags];

  const handleTagClick = (tag: string) => {
    if (tag === "All") {
      setSearchQuery("");
    } else {
      onTagClick(tag);
    }
  };

  return (
    <div className="mb-[1rem]">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

      <div className="mt-[1rem]">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="transition-opacity hover:opacity-70"
            >
              <Badge>{tag}</Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
