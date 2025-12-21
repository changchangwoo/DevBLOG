/**
 * 마크다운 콘텐츠에서 헤딩을 추출합니다.
 */

export interface TocHeading {
  id: string;
  text: string;
  level: number; // 1, 2, 3 (h1, h2, h3)
}

/**
 * 마크다운 텍스트에서 헤딩을 추출하여 목차 데이터를 생성합니다.
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length; // #의 개수
    const text = match[2].trim();

    // ID 생성 (rehype-slug와 동일한 방식)
    const id = text
      .toLowerCase()
      .replace(/[^\w가-힣\s-]/g, '') // 특수문자 제거
      .replace(/\s+/g, '-') // 공백을 하이픈으로
      .replace(/-+/g, '-') // 연속 하이픈 제거
      .replace(/^-|-$/g, ''); // 앞뒤 하이픈 제거

    headings.push({ id, text, level });
  }

  return headings;
}
