"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { PostPreview } from "@/lib/posts";

interface PostListProps {
  posts: PostPreview[];
  tags: string[];
}

export default function PostList({ posts, tags }: PostListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase();
    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(query);
      const excerptMatch = post.excerpt.toLowerCase().includes(query);
      const tagMatch = post.tag.some((tag) =>
        tag.toLowerCase().includes(query)
      );

      return titleMatch || excerptMatch || tagMatch;
    });
  }, [posts, searchQuery]);

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  return (
    <>
      {/* 검색바 */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목, 발췌, 태그로 검색..."
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          />
          <svg
            className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
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

        {/* 인기 태그 */}
        {tags.length > 0 && (
          <div className="mt-4">
            <p className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              인기 태그
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {searchQuery && (
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {filteredPosts.length}개의 포스트를 찾았습니다
          </p>
        )}
      </div>

      <h2 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {searchQuery ? "검색 결과" : "최근 포스트"}
      </h2>
      <div className="space-y-12">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group relative rounded-lg border border-zinc-200 bg-white p-6  hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <Link href={`/post/${post.slug}`}>
                <div className="flex flex-col gap-2">
                  <time className="text-sm text-zinc-500 dark:text-zinc-400">
                    {new Date(post.date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h3 className="text-2xl font-semibold tracking-tight text-zinc-900  group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {post.tag.length > 0 && (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {post.tag.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))
        ) : (
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            검색 결과가 없습니다
          </p>
        )}
      </div>
    </>
  );
}
