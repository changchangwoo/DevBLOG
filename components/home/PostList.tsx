"use client";

import { useMemo, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { PostPreview } from "@/lib/posts";
import { filterPosts } from "@/lib/filter";
import PostCard from "@/components/common/PostCard";
import Divider from "@/components/common/Divider";
import SearchBar from "@/components/home/SearchBar";

interface PostListProps {
  posts: PostPreview[];
  tags: string[];
}

export default function PostList({ posts, tags }: PostListProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    const search = searchParams.get("search") || "";
    setSearchQuery(search);
  }, [searchParams]);

  const filteredPosts = useMemo(() => {
    const tag = searchParams.get("tag") || undefined;
    const category = searchParams.get("category") || undefined;
    const search = searchQuery.trim() || undefined;

    return filterPosts(posts, { tag, category, search });
  }, [posts, searchParams, searchQuery]);

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tag", tag);
    params.delete("category");
    params.delete("search");
    router.push(`/?${params.toString()}`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    params.delete("tag");
    params.delete("category");
    router.push(`/?${params.toString()}`);
  };

  return (
    <>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        tags={tags}
        onTagClick={handleTagClick}
      />
      <Divider
        label={`총 ${filteredPosts.length}개의 포스트  `}
        spacing="lg"
        className="body3 text-descript"
      />
      <section className="ut-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p
            className="text-center text-primary"
            style={{ gridColumn: "1 / -1" }}
          >
            검색 결과가 없습니다
          </p>
        )}
      </section>
    </>
  );
}
