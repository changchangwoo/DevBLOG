import { notFound } from "next/navigation";
import { getAllPosts, getTotalPages, getPostsByPage } from "@/lib/posts";
import { filterPosts } from "@/lib/filter";
import { getCategoryInfo } from "@/lib/category";
import Divider from "@/components/common/Divider";
import PostCard from "@/components/common/PostCard";
import PageLayout from "@/components/layout/PageLayout";
import Pagination from "@/components/posts/Pagination";
import type { Metadata } from "next";

interface PostsPageProps {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}

export const metadata: Metadata = {
  title: "Posts | DevBLOG",
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { category, tag, page: pageParam } = await searchParams;
  const pageNumber = pageParam ? parseInt(pageParam, 10) : 1;

  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const allPosts = getAllPosts();
  const filteredPosts = filterPosts(allPosts, { category, tag });
  const totalPages = getTotalPages(filteredPosts.length);

  if (pageNumber > totalPages && totalPages > 0) {
    notFound();
  }

  const posts = getPostsByPage(filteredPosts, pageNumber);

  const filterLabel = category
    ? getCategoryInfo(category).label
    : tag
      ? tag
      : null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `/posts?${query}` : "/posts";
  };

  return (
    <PageLayout>
      <Divider
        label={filterLabel ? `${filterLabel}` : "전체"}
        subLabel={`총 ${filteredPosts.length}개의 포스트`}
        className="title2"
        spacing="md"
      />
      <section className="ut-grid">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.slug} post={post} />)
        ) : (
          <p
            className="text-center text-primary body1"
            style={{ gridColumn: "1 / -1" }}
          >
            포스트가 없습니다
          </p>
        )}
      </section>
      {totalPages > 1 && (
        <Pagination
          currentPage={pageNumber}
          totalPages={totalPages}
          hrefBuilder={buildHref}
        />
      )}
    </PageLayout>
  );
}
