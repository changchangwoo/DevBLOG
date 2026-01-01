import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

/**
 * Callout 박스 지원 Rehype 플러그인
 *
 * 모든 blockquote를 카테고리 색상의 Callout으로 변환
 *
 * 문법:
 * > 강조하고 싶은 내용
 *
 * 카테고리별 색상:
 * - activities: #e5533d (빨강)
 * - tech: #2563eb (파랑)
 * - life: #7c3aed (보라)
 * - project: #059669 (초록)
 */

interface RehypeCalloutOptions {
  category?: string;
}

export default function rehypeCallout(options: RehypeCalloutOptions = {}) {
  const { category = "all" } = options;

  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      // blockquote 요소만 처리
      if (node.tagName !== "blockquote") {
        return;
      }

      if (parent && typeof index === "number") {
        const calloutBox: Element = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["callout"],
            dataCategory: category,
          },
          children: [
            {
              type: "element",
              tagName: "div",
              properties: {
                className: ["callout-content"],
              },
              children: node.children,
            },
          ],
        };

        parent.children[index] = calloutBox;
      }
    });
  };
}
