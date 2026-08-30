import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";
import type { Element, ElementContent, Root } from "hast";
import rehypeHeadingDivider from "./rehype-heading-divider";
import rehypeCallout from "./rehype-callout";
import rehypeImage from "./rehype-image";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

function toPlainText(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") return node.children.map(toPlainText).join("");
  return "";
}

/**
 * rehype-slug가 부여한 id를 그대로 수집한다.
 * 목차 링크와 본문 heading의 id가 같은 출처에서 나오므로
 * 중복 제목(`-1`, `-2` 접미사)이나 특수문자에서도 어긋나지 않는다.
 */
function rehypeCollectHeadings(headings: TocHeading[]) {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      const match = /^h([1-3])$/.exec(node.tagName);
      if (!match) return;

      const id = node.properties?.id;
      if (typeof id !== "string" || id.length === 0) return;

      headings.push({
        id,
        text: node.children.map(toPlainText).join("").trim(),
        level: Number(match[1]),
      });
    });
  };
}

export interface RenderedMarkdown {
  html: string;
  headings: TocHeading[];
}

interface RenderOptions {
  /** 콜아웃 색상 등에 쓰이는 카테고리 */
  category?: string;
  /** 목차 수집 여부 (TIL처럼 목차가 없는 문서는 false) */
  collectHeadings?: boolean;
}

/**
 * 마크다운을 HTML로 변환하면서 목차를 함께 수집한다.
 * 본문과 목차가 같은 파싱 결과에서 나오도록 한 번만 파싱한다.
 */
export async function renderMarkdown(
  markdown: string,
  { category = "all", collectHeadings = false }: RenderOptions = {},
): Promise<RenderedMarkdown> {
  const headings: TocHeading[] = [];

  const processor = remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    // 본문에 직접 쓴 HTML(<img>, <table>, <video>)을 실제 노드로 파싱한다.
    // 이게 없으면 raw 문자열로 남아 rehypeImage 같은 플러그인이 보지 못하고,
    // 이미지 최적화를 그대로 지나친다.
    .use(rehypeRaw)
    .use(rehypeSlug);

  if (collectHeadings) {
    processor.use(rehypeCollectHeadings, headings);
  }

  const result = await processor
    .use(rehypeCallout, { category })
    .use(rehypeHeadingDivider)
    .use(rehypeImage)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return { html: result.toString(), headings };
}

/** 목차가 필요 없는 곳을 위한 축약 형태 */
export async function markdownToHtml(
  markdown: string,
  category?: string,
): Promise<string> {
  const { html } = await renderMarkdown(markdown, { category });
  return html;
}
