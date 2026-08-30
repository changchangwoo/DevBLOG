import { getAllCategories, getAllPosts, getAllTag } from "@/lib/posts";
import type { Category, PostSummary, Tag } from "@/lib/posts";

export const dynamic = "force-static";

export interface SearchIndex {
  posts: PostSummary[];
  categories: Category[];
  tags: Tag[];
}

/**
 * 검색 모달이 열릴 때만 내려받는 인덱스.
 * 이 데이터를 헤더 props로 넘기면 모든 페이지의 RSC 페이로드에 중복 포함된다.
 */
export async function GET() {
  const index: SearchIndex = {
    posts: getAllPosts(),
    categories: getAllCategories(),
    tags: getAllTag(),
  };

  return Response.json(index, {
    headers: {
      // Next 기본값은 s-maxage뿐이라 브라우저가 캐시하지 못하고 매번 다시 받는다.
      // 내용은 배포할 때만 바뀌므로 브라우저에도 짧은 수명을 주고,
      // 그 뒤에는 stale을 쓰면서 뒤에서 갱신하게 한다.
      "Cache-Control":
        "public, max-age=300, s-maxage=31536000, stale-while-revalidate=86400",
    },
  });
}
