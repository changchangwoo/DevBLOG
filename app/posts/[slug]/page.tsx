import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, markdownToHtml } from "@/lib/posts";
import { extractHeadings } from "@/lib/toc";
import TableOfContents from "@/app/components/TableOfContents";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | ChangWoo의 블로그`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch (error) {
    notFound();
  }

  const content = await markdownToHtml(post.content);
  const headings = extractHeadings(post.content);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="relative">
          <article className="flex-1 min-w-0 max-w-3xl">
            <header className="mb-12 mt-8">
              <time className="text-sm text-zinc-500 dark:text-zinc-400">
                {new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                {post.excerpt}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span>작성자: {post.author.name}</span>
              </div>
              <div className="flex gap-2">
                {post.tag &&
                  post.tag.map((item, index) => (
                    <span key={`${item}-${index}`} className="tag-style">
                      {item}
                    </span>
                  ))}
              </div>
            </header>
            <div
              className="
              prose max-w-none
              prose-img:rounded-2xl
              prose-img:border
              prose-img:border-zinc-200
              dark:prose-img:border-zinc-800
              dark:prose-invert
              "
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <footer className="mt-16 border-t border-zinc-200 pt-8 dark:border-zinc-800">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-zinc-600  hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                홈으로 돌아가기
              </Link>
            </footer>
          </article>
          <aside className="hidden xl:block absolute left-full top-16 h-full">
            {/* h-full을 주어야 sticky가 따라올 수 있는 '길'이 생깁니다 */}
            <div className="sticky top-24 w-64">
              <TableOfContents headings={headings} />
            </div>
          </aside>{" "}
        </div>
      </div>
    </div>
  );
}
