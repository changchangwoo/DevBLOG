import { visit } from "unist-util-visit";
import type { Element, Root } from "hast";
import { buildSrcSet, getImageMeta, optimizedSrc, snapWidth } from "./image";

interface RehypeImageOptions {
  /** 본문 이미지가 차지하는 최대 폭 (레이아웃 기준) */
  sizes?: string;
  /** srcset 상한. 본문 슬롯은 760px이라 1200이면 약 1.6배로 충분하다. */
  maxWidth?: number;
}

/**
 * 마크다운 본문의 <img>를 최적화된 형태로 바꾼다.
 *
 * 마크다운은 HTML 문자열로 렌더되므로 next/image 컴포넌트를 쓸 수 없다.
 * 대신 next/image가 내부적으로 쓰는 /_next/image 엔드포인트를 직접 가리키고,
 * 블러 썸네일은 background-image로 심는다.
 * 이미지가 로드되면 자기 자신이 배경을 덮으므로 클라이언트 JS가 필요 없다.
 */
export default function rehypeImage({
  // 본문 폭: max-w-7xl(800px) - 좌우 패딩 40px = 760px (루트 font-size 62.5%)
  sizes = "(min-width: 800px) 760px, calc(100vw - 40px)",
  maxWidth = 1200,
}: RehypeImageOptions = {}) {
  return async (tree: Root) => {
    const targets: Element[] = [];

    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img") return;
      const src = node.properties?.src;
      // 외부 이미지는 최적화 대상이 아니다 (원격 도메인 허용 설정 필요)
      if (typeof src !== "string" || !src.startsWith("/")) return;
      targets.push(node);
    });

    // 이미지가 여러 장이므로 병렬로 메타데이터를 읽는다.
    await Promise.all(
      targets.map(async (node) => {
        const src = node.properties!.src as string;
        const meta = await getImageMeta(src);
        if (!meta) return;

        node.properties = {
          ...node.properties,
          src: optimizedSrc(src, snapWidth(Math.min(meta.width, maxWidth))),
          srcSet: buildSrcSet(src, meta.width, maxWidth),
          sizes,
          width: meta.width,
          height: meta.height,
          className: ["md-img"],
          loading: "lazy",
          decoding: "async",
          style: `background-image:url(${meta.blurDataURL});background-size:cover;background-position:center`,
        };
      }),
    );
  };
}
