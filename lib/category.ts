export interface CategoryInfo {
  label: string;
  colorClass: string;
}

const categoryMap: Record<string, CategoryInfo> = {
  activities: { label: "활동", colorClass: "bg-category-activity" },
  life: { label: "일상", colorClass: "bg-category-life" },
  projects: { label: "프로젝트", colorClass: "bg-category-project" },
  tech: { label: "기술", colorClass: "bg-category-tech" },
};

export function getCategoryInfo(category: string): CategoryInfo {
  return (
    categoryMap[category] || { label: category, colorClass: "bg-secondary" }
  );
}
