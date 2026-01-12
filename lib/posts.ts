import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import rehypeHeadingDivider from "./rehype-heading-divider";
import rehypeCallout from "./rehype-callout";

const postsDirectory = path.join(process.cwd(), "_posts");

export interface PostMetadata {
  title: string;
  description: string;
  date: string;
  author: {
    name: string;
  };
  tag?: string[];
  category?: string;
  coverImage?: string;
}

export interface Post extends PostMetadata {
  slug: string;
  content: string;
  tag: string[];
  category: string;
}

export interface PostPreview extends PostMetadata {
  slug: string;
  tag: string[];
  category: string;
}

export interface Tag {
  name: string;
  count: number;
}

export interface Category {
  name: string;
  count: number;
}

export function getPostSlugs(): string[] {
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
}

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const slugParts = realSlug.split("/");
  const categoryFromPath =
    slugParts.length > 1 ? slugParts[0] : "uncategorized";

  const metadata = data as PostMetadata;

  return {
    slug: realSlug,
    content,
    ...metadata,
    tag: metadata.tag || [],
    category: metadata.category || categoryFromPath,
  };
}

export function getAllPosts(): PostPreview[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      return {
        slug: post.slug,
        title: post.title,
        description: post.description,
        tag: post.tag,
        category: post.category,
        date: post.date,
        author: post.author,
        coverImage: post.coverImage,
      };
    })
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}

export function getAllTag(): Tag[] {
  const posts = getAllPosts();

  const tagFrequency = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tag) {
      tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
    }
  }

  console.log(tagFrequency);

  return Array.from(tagFrequency.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPinnedPost(): PostPreview | null {
  const posts = getAllPosts();
  const { PINNED_POST_SLUG } = require("@/constant/const");

  const pinnedPost = posts.find((post) => post.slug === PINNED_POST_SLUG);
  return pinnedPost || null;
}

export function getAllCategories(): Category[] {
  const posts = getAllPosts();
  const categoryFrequency = new Map<string, number>();

  for (const post of posts) {
    if (post.category && post.category !== "uncategorized") {
      categoryFrequency.set(
        post.category,
        (categoryFrequency.get(post.category) || 0) + 1
      );
    }
  }

  return Array.from(categoryFrequency.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function markdownToHtml(
  markdown: string,
  category: string = "all"
): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeCallout, { category })
    .use(rehypeHeadingDivider)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return result.toString();
}
