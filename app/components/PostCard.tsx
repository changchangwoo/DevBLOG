import Link from "next/link";
import type { PostPreview } from "@/lib/posts";

interface PostCardProps {
  post: PostPreview;
  showCategory?: boolean;
}

export default function PostCard({ post, showCategory = true }: PostCardProps) {
  return (
    <article className="group relative rounded-lg border border-zinc-200 bg-white p-6 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <Link href={`/post/${post.slug}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <time className="text-sm text-zinc-500 dark:text-zinc-400">
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {showCategory && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                {post.category}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-semibold tracking-tight text-zinc-900  group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
            {post.title}
          </h3>
          <p className="mt-2 text-zinc-700 dark:text-zinc-300">
            {post.excerpt}
          </p>
          {post.tag.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tag.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
