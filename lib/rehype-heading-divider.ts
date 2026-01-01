import { visit } from "unist-util-visit";
import type { Root, Element } from "hast";

export default function rehypeHeadingDivider() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName === "h2" || node.tagName === "h3") {
        if (parent && typeof index === "number") {
          const wrapper: Element = {
            type: "element",
            tagName: "div",
            properties: {
              className: ["heading-with-divider"],
            },
            children: [
              node,
              {
                type: "element",
                tagName: "div",
                properties: {
                  className: ["heading-divider"],
                },
                children: [],
              },
            ],
          };

          parent.children[index] = wrapper;
        }
      }
    });
  };
}
