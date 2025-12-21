import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Post() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            검색페이지
          </h1>
        </header>

        <section>
          <h2 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            최근 포스트
          </h2>
          <div className="space-y-12">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group relative rounded-lg border border-zinc-200 bg-white p-6  hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <Link href={`/posts/${post.slug}`}>
                  <div className="flex flex-col gap-2">
                    <time className="text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(post.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <h3 className="text-2xl font-semibold tracking-tight text-zinc-900  group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span>작성자: {post.author.name}</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
