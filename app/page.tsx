import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            ChangWoo의 개발 블로그
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Next.js, TypeScript, 그리고 웹 개발에 대한 생각을 공유합니다.
          </p>
        </header>

        <section>
          <h2 className="mb-8 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            최근 포스트
          </h2>
          <div className="space-y-12">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group relative rounded-lg border border-zinc-200 bg-white p-6 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <Link href={`/posts/${post.slug}`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <time className="text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(post.date).toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight text-zinc-900  group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
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
