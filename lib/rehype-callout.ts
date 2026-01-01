import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

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
