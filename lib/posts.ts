import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), '_posts');

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
  return fs.readdirSync(postsDirectory)
    .filter(file => file.endsWith('.md'));
}

/**
 * 슬러그로 포스트를 가져옵니다.
 */
export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
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
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(html, { sanitize: false })
    .process(markdown);
  return result.toString();
}
