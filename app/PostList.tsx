"use client";

import { useState, useMemo } from "react";
import type { PostPreview } from "@/lib/posts";
import PostCard from "@/components/PostCard/PostCard";
import Divider from "@/components/Divider";
import SearchBar from "@/app/SearchBar";

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
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tags={tags}
        onTagClick={handleTagClick}
      />
      <Divider
        label={`👀 총 ${filteredPosts.length}개의 포스트 발견!  `}
        spacing="md"
        className="body3 text-descript"
      />
      <section>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            검색 결과가 없습니다
          </p>
        )}
      </section>
    </>
  );
}
