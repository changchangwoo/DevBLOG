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
  coverImage?: string;
}

export interface Post extends PostMetadata {
  slug: string;
  content: string;
}

export interface PostPreview extends PostMetadata {
  slug: string;
}

/**
 * _posts 디렉토리에서 모든 포스트의 슬러그 목록을 가져옵니다.
 */
export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));
}

/**
 * 슬러그로 포스트를 가져옵니다.
 */
export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    content,
    ...(data as PostMetadata),
  };
}

/**
 * 모든 포스트를 가져옵니다 (날짜 기준 내림차순 정렬).
 */
export function getAllPosts(): PostPreview[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => {
      const post = getPostBySlug(slug);
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        date: post.date,
        author: post.author,
        coverImage: post.coverImage,
      };
    })
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  return posts;
}

/**
 * Markdown 콘텐츠를 HTML로 변환합니다.
 * - GitHub Flavored Markdown 지원 (테이블, 체크박스 등)
 * - 코드 블록 신택스 하이라이팅
 * - 헤딩에 자동 ID 및 링크 추가
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkRehype, { allowDangerousHtml: true }) // remark -> rehype 변환
    .use(rehypeSlug) // 헤딩에 id 추가
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap", // 헤딩 전체를 링크로 감싸기
      properties: {
        className: ["heading-link"],
      },
    })
    .use(rehypeHighlight) // 코드 하이라이팅 (언어 감지 자동)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return result.toString();
}
