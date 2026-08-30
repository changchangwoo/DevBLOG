import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import { PINNED_POST_SLUG } from "@/constant/const";

const postsDirectory = path.join(process.cwd(), "_posts");

/** _posts/*.md 의 Front Matter 원본 형태 */
export interface PostFrontMatter {
  title: string;
  description: string;
  date: string;
  tag?: string[];
  category?: string;
  coverImage?: string;
}

/** 목록/카드/검색에서 쓰이는 최소 메타데이터 */
export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  date: string;
  tag: string[];
  category: string;
  coverImage?: string;
}

export interface Post extends PostSummary {
  content: string;
}

export interface Tag {
  name: string;
  count: number;
}

export interface Category {
  name: string;
  count: number;
}

export const getPostSlugs = cache((): string[] => {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const slugs: string[] = [];

  function scanDirectory(dir: string, prefix: string = "") {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        scanDirectory(fullPath, prefix ? `${prefix}/${file.name}` : file.name);
      } else if (file.name.endsWith(".md")) {
        const slug = prefix
          ? `${prefix}/${file.name.replace(/\.md$/, "")}`
          : file.name.replace(/\.md$/, "");
        slugs.push(slug);
      }
    }
  }

  scanDirectory(postsDirectory);
  return slugs;
});

export const getPostBySlug = cache((slug: string): Post | null => {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);

  if (!fullPath.startsWith(postsDirectory) || !fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const slugParts = realSlug.split("/");
  const categoryFromPath =
    slugParts.length > 1 ? slugParts[0] : "uncategorized";

  const metadata = data as PostFrontMatter;

  return {
    slug: realSlug,
    content,
    ...metadata,
    tag: metadata.tag || [],
    category: metadata.category || categoryFromPath,
  };
});

export const getAllPosts = cache((): PostSummary[] => {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .map((post) => {
      return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        tag: post.tag,
        category: post.category,
        date: post.date,
        coverImage: post.coverImage,
      };
    })
    .sort((post1, post2) => post2.date.localeCompare(post1.date));

  return posts;
});

export const getAllTag = cache((): Tag[] => {
  const posts = getAllPosts();

  const tagFrequency = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tag) {
      tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagFrequency.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
});

export const getPinnedPost = cache((): PostSummary | null => {
  const posts = getAllPosts();

  const pinnedPost = posts.find((post) => post.slug === PINNED_POST_SLUG);
  return pinnedPost || null;
});

export const getAllCategories = cache((): Category[] => {
  const posts = getAllPosts();
  const categoryFrequency = new Map<string, number>();

  for (const post of posts) {
    if (post.category && post.category !== "uncategorized") {
      categoryFrequency.set(
        post.category,
        (categoryFrequency.get(post.category) || 0) + 1,
      );
    }
  }

  return Array.from(categoryFrequency.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
});

export const POSTS_PER_PAGE = 6;

export function getTotalPages(totalPosts: number): number {
  return Math.ceil(totalPosts / POSTS_PER_PAGE);
}

export function getPostsByPage(
  posts: PostSummary[],
  page: number,
): PostSummary[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return posts.slice(start, start + POSTS_PER_PAGE);
}
