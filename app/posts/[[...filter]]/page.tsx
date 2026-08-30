import { notFound } from "next/navigation";
import {
  getAllCategories,
  getAllPosts,
  getAllTag,
  getPostsByPage,
  getTotalPages,
} from "@/lib/posts";
import { filterPosts } from "@/lib/filter";
import { getCategoryInfo } from "@/lib/category";
import Divider from "@/components/common/Divider";
import PostCard from "@/components/common/PostCard";
import PageLayout from "@/components/layout/PageLayout";
import Pagination from "@/components/posts/Pagination";
import type { Metadata } from "next";

interface PostsPageProps {
  params: Promise<{ filter?: string[] }>;
}

interface ResolvedFilter {
  category?: string;
  tag?: string;
  page: number;
}

const CATEGORY_SEGMENT = "category";
const TAG_SEGMENT = "tag";

const isPageSegment = (segment: string) => /^[1-9]\d*$/.test(segment);

/**
 * generateStaticParams는 원본 문자열("회고", "AWS S3")을 그대로 반환해야 한다.
 * 여기서 미리 encodeURIComponent 하면 정적 경로 매칭이 깨진다.
 * 반면 런타임 세그먼트는 인코딩된 채로 들어올 수 있으므로 방어적으로 디코딩한다.
 * (이미 디코딩된 값에 대해서는 no-op)
 */
function safeDecode(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

/**
 * URL 세그먼트를 필터로 해석한다.
 *   /posts                    → 전체 1페이지
 *   /posts/2                  → 전체 2페이지
 *   /posts/category/tech      → 카테고리 1페이지
 *   /posts/category/tech/2    → 카테고리 2페이지
 *   /posts/tag/Next.js        → 태그 1페이지
 * 해석할 수 없으면 null(404).
 */
function resolveFilter(segments: string[] = []): ResolvedFilter | null {
  if (segments.length === 0) return { page: 1 };

  if (segments.length === 1) {
    // 1페이지는 정규 URL(/posts)만 사용한다
    if (!isPageSegment(segments[0]) || segments[0] === "1") return null;
    return { page: Number(segments[0]) };
  }

  const [kind, rawValue, ...rest] = segments;
  if (kind !== CATEGORY_SEGMENT && kind !== TAG_SEGMENT) return null;
  if (!rawValue) return null;
  if (rest.length > 1) return null;

  const value = safeDecode(rawValue);
  if (!value) return null;

  let page = 1;
  if (rest.length === 1) {
    if (!isPageSegment(rest[0]) || rest[0] === "1") return null;
    page = Number(rest[0]);
  }

  return kind === CATEGORY_SEGMENT
    ? { category: value, page }
    : { tag: value, page };
}

function buildHref(filter: Omit<ResolvedFilter, "page">, page: number): string {
  const base = filter.category
    ? `/posts/${CATEGORY_SEGMENT}/${encodeURIComponent(filter.category)}`
    : filter.tag
      ? `/posts/${TAG_SEGMENT}/${encodeURIComponent(filter.tag)}`
      : "/posts";

  return page === 1 ? base : `${base}/${page}`;
}

function getFilterLabel(filter: ResolvedFilter): string | null {
  if (filter.category) return getCategoryInfo(filter.category).label;
  return filter.tag ?? null;
}

// 정적 생성된 경로 외에는 런타임 렌더링 없이 404 처리한다
export const dynamicParams = false;

export async function generateStaticParams() {
  const allPosts = getAllPosts();

  const groups: { prefix: string[]; posts: typeof allPosts }[] = [
    { prefix: [], posts: allPosts },
    ...getAllCategories().map((category) => ({
      prefix: [CATEGORY_SEGMENT, category.name],
      posts: filterPosts(allPosts, { category: category.name }),
    })),
    ...getAllTag().map((tag) => ({
      prefix: [TAG_SEGMENT, tag.name],
      posts: filterPosts(allPosts, { tag: tag.name }),
    })),
  ];

  return groups.flatMap(({ prefix, posts }) => {
    const totalPages = getTotalPages(posts.length);
    const pages = Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) =>
      String(i + 2),
    );
    return [
      { filter: prefix },
      ...pages.map((page) => ({ filter: [...prefix, page] })),
    ];
  });
}

export async function generateMetadata({
  params,
}: PostsPageProps): Promise<Metadata> {
  const { filter: segments } = await params;
  const filter = resolveFilter(segments);

  if (!filter) return { title: "Posts | DevBLOG" };

  const label = getFilterLabel(filter);
  const suffix = filter.page > 1 ? ` - ${filter.page}페이지` : "";

  return {
    title: `${label ? `${label} ` : ""}Posts${suffix} | DevBLOG`,
    alternates: { canonical: buildHref(filter, filter.page) },
  };
}

export default async function PostsPage({ params }: PostsPageProps) {
  const { filter: segments } = await params;
  const filter = resolveFilter(segments);

  if (!filter) {
    notFound();
  }

  const filteredPosts = filterPosts(getAllPosts(), {
    category: filter.category,
    tag: filter.tag,
  });

  if (filteredPosts.length === 0) {
    notFound();
  }

  const totalPages = getTotalPages(filteredPosts.length);
  if (filter.page > totalPages) {
    notFound();
  }

  const posts = getPostsByPage(filteredPosts, filter.page);
  const label = getFilterLabel(filter);

  return (
    <PageLayout>
      <Divider
        label={label ?? "전체"}
        subLabel={`총 ${filteredPosts.length}개의 포스트`}
        className="title2"
        spacing="md"
      />
      <section className="ut-grid">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>
      {totalPages > 1 && (
        <Pagination
          currentPage={filter.page}
          totalPages={totalPages}
          hrefBuilder={(page) => buildHref(filter, page)}
        />
      )}
    </PageLayout>
  );
}
