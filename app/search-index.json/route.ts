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

  return Response.json(index);
}
