import { getAllCategories, getAllTag } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import Badge from "./Badge";
import Link from "next/link";
import Divider from "./Divider";

export default function CategoryList() {
  const categories = getAllCategories();
  const tags = getAllTag();

  if (categories.length === 0) {
    return null;
  }

  const TagIcon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );

  return (
    <div className="flex flex-col gap-[2rem]">
      <div>
        <Divider icon={TagIcon} spacing="lg" className="caption" />
        <div className="flex flex-wrap gap-2 mt-4">
          <Link href="/">
            <Badge variant="category" colorClass="bg-category-all">
              전체
            </Badge>
          </Link>
          {categories.map((category) => {
            const categoryInfo = getCategoryInfo(category.name);
            return (
              <Link key={category.name} href={`/?category=${category.name}`}>
                <Badge variant="category" colorClass={categoryInfo.colorClass}>
                  {categoryInfo.label}
                </Badge>
              </Link>
            );
          })}
          {tags.map((tag) => (
            <Link key={tag.name} href={`/?tag=${tag.name}`}>
              <Badge>{tag.name}</Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
