import { CATEGORY_MAP, CategoryInfo } from "@/constant/const";

export type { CategoryInfo };

export function getCategoryInfo(category: string): CategoryInfo {
  return (
    CATEGORY_MAP[category] || { label: category, colorClass: "bg-secondary" }
  );
}
