import { getAllPosts } from "@/lib/posts";
import PostCard from "./components/PostCard";

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
              <PostCard key={post.slug} post={post} showCategory={true} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
