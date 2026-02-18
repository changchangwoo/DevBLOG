import { notFound } from "next/navigation";
import {
  getAllPosts,
  getPinnedPost,
  getTotalPages,
  getPostsByPage,
} from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import { generateWebSiteJsonLd } from "@/lib/jsonld";
import Divider from "@/components/common/Divider";
import PostCard from "@/components/common/PostCard";
import PageLayout from "@/components/layout/PageLayout";
import PinnedPost from "@/components/home/PinnedPost";
import Pagination from "@/components/posts/Pagination";
import type { Metadata } from "next";

interface HomePageProps {
  params: Promise<{ page?: string[] }>;
}

export async function generateStaticParams() {
  const total = getAllPosts().length;
  const totalPages = getTotalPages(total);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: [String(i + 2)],
  }));
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { page: pageParam } = await params;
  const pageNumber = pageParam ? parseInt(pageParam[0], 10) : 1;

  if (pageNumber === 1) {
    return {
      title: "DevBLOG",
      alternates: { canonical: "/" },
    };
  }

  return {
    title: `Posts - ${pageNumber}페이지 | DevBLOG`,
    alternates: { canonical: `/${pageNumber}` },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { page: pageParam } = await params;
  const pageNumber = pageParam ? parseInt(pageParam[0], 10) : 1;

  if (pageParam !== undefined) {
    if (isNaN(pageNumber) || pageNumber <= 1 || pageParam.length > 1) {
      notFound();
    }
  }

  const allPosts = getAllPosts();
  const totalPages = getTotalPages(allPosts.length);

  if (pageNumber > totalPages && totalPages > 0) {
    notFound();
  }

  const posts = getPostsByPage(allPosts, pageNumber);
  const pinnedPost = pageNumber === 1 ? getPinnedPost() : null;
  const categoryInfo = pinnedPost ? getCategoryInfo(pinnedPost.category) : null;

  return (
    <PageLayout>
      {pageNumber === 1 && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateWebSiteJsonLd()),
            }}
          />
          <section>
            <PinnedPost pinnedPost={pinnedPost} categoryInfo={categoryInfo} />
          </section>
        </>
      )}
      <section className="flex flex-col gap-[2rem]">
        <Divider
          label="포스트"
          subLabel={`총 ${allPosts.length}개의 포스트`}
          spacing="md"
          className="title2"
        />
        <div className="ut-grid">
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
        </div>
      </section>
      {totalPages > 1 && (
        <Pagination currentPage={pageNumber} totalPages={totalPages} />
      )}
    </PageLayout>
  );
}
