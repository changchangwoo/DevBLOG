import type { PostPreview } from "./posts";

export interface FilterParams {
  tag?: string;
  category?: string;
  search?: string;
}

export function filterPosts(
  posts: PostPreview[],
  filters: FilterParams
): PostPreview[] {
  let filtered = [...posts];

  if (filters.category) {
    filtered = filtered.filter((post) => post.category === filters.category);
  }

  if (filters.tag) {
    filtered = filtered.filter((post) => post.tag.includes(filters.tag!));
  }

  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(query);
      const descriptionMatch = post.description.toLowerCase().includes(query);
      const tagMatch = post.tag.some((tag) =>
        tag.toLowerCase().includes(query)
      );

      return titleMatch || descriptionMatch || tagMatch;
    });
  }

  return filtered;
}
