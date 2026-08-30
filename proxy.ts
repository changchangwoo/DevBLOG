import { NextResponse, type NextRequest } from "next/server";

/**
 * 쿼리 기반이던 이전 URL을 경로 세그먼트 URL로 308 연결한다.
 *
 * next.config.ts의 redirects()로는 처리할 수 없다.
 * Next가 매칭된 쿼리 값을 디코딩한 채 Location 헤더에 넣기 때문에
 * 한글·공백이 섞인 태그에서 ERR_INVALID_CHAR로 500이 난다.
 * URL 객체는 퍼센트 인코딩을 알아서 처리하므로 여기서는 그 문제가 없다.
 *
 *   /posts?category=tech&page=2  →  /posts/category/tech/2
 *   /posts?tag=회고              →  /posts/tag/%ED%9A%8C%EA%B3%A0
 *   /til?year=2025               →  /til/2025
 */

/** 2 이상만 경로에 붙인다. 1페이지는 접미사 없는 정규 URL을 쓴다. */
function pageSuffix(raw: string | null): string {
  if (!raw || !/^[1-9][0-9]*$/.test(raw)) return "";
  return raw === "1" ? "" : `/${raw}`;
}

function resolveLegacyPath(pathname: string, query: URLSearchParams) {
  if (pathname === "/til") {
    const year = query.get("year");
    return year && /^\d{4}$/.test(year) ? `/til/${year}` : null;
  }

  if (pathname === "/posts") {
    const category = query.get("category");
    const tag = query.get("tag");
    const suffix = pageSuffix(query.get("page"));

    if (category) return `/posts/category/${category}${suffix}`;
    if (tag) return `/posts/tag/${tag}${suffix}`;
    return suffix ? `/posts${suffix}` : null;
  }

  return null;
}

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const target = resolveLegacyPath(pathname, searchParams);

  if (!target) return NextResponse.next();

  // URL 생성자가 비ASCII 세그먼트를 퍼센트 인코딩한다.
  const url = new URL(target, request.nextUrl.origin);
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/posts", "/til"],
};
