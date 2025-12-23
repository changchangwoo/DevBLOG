"use client";

import { useState, useMemo } from "react";
import type { PostPreview } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Divider from "@/components/Divider";
import Badge from "@/components/Badge";

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

        {tags.length > 0 && (
          <div className="mt-[1rem]">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
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
        )}


      </div>
      <Divider label={`총 ${filteredPosts.length}건`} spacing="lg" className="body1" color="primary"/>
      <div className="space-y-12">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} showCategory={true} />
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
