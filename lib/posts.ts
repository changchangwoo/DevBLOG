import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "_posts");

export interface PostMetadata {
  title: string;
  excerpt: string;
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
        // 재귀적으로 하위 폴더 탐색
        scanDirectory(fullPath, prefix ? `${prefix}/${file.name}` : file.name);
      } else if (file.name.endsWith(".md")) {
        // .md 파일이면 슬러그 배열에 추가
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

  // 슬러그에서 카테고리 추출 (예: "javascript/arrays" -> "javascript")
  const slugParts = realSlug.split("/");
  const categoryFromPath =
    slugParts.length > 1 ? slugParts[0] : "uncategorized";

  const metadata = data as PostMetadata;

  return {
    slug: realSlug,
    content,
    ...metadata,
    // front matter에 tag가 없으면 빈 배열 사용
    tag: metadata.tag || [],
    // front matter에 category가 없으면 폴더 경로에서 추출한 카테고리 사용
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
        excerpt: post.excerpt,
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

export function getRecentTag(): string[] {
  const posts = getAllPosts();

  // 태그 빈도수를 계산
  const tagFrequency = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tag) {
      tagFrequency.set(tag, (tagFrequency.get(tag) || 0) + 1);
    }
  }

  // 빈도순으로 정렬하고 상위 20개만 반환
  return Array.from(tagFrequency.entries())
    .sort((a, b) => b[1] - a[1]) // 빈도 내림차순
    .slice(0, 20)
    .map(([tag]) => tag);
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return result.toString();
}
