import { getAllCategories, getRecentTag } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import Badge from "./Badge";
import Link from "next/link";
import Divider from "./Divider";

export default function CategoryList() {
  const categories = getAllCategories();
  const tags = getRecentTag();

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

  console.log(categories);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Divider icon={TagIcon} spacing="lg" className="caption" />
        <div className="flex flex-wrap gap-2 ">
          {categories.map((category) => {
            const categoryInfo = getCategoryInfo(category);
            console.log(categoryInfo);
            return (
              <Link key={category} href={`/?category=${category}`}>
                <Badge variant="category" colorClass={categoryInfo.colorClass}>
                  {categoryInfo.label}
                </Badge>
              </Link>
            );
          })}
          {tags.map((tag) => (
            <button key={tag} className="transition-opacity hover:opacity-70">
              <Badge>{tag}</Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
