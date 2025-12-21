import { getAllPosts, getRecentTag } from "@/lib/posts";
import PostList from "./PostList";

export default function Post() {
  const posts = getAllPosts();
  const tags = getRecentTag();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <header className="mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            아티클
          </h1>
        </header>

        <section>
          <PostList posts={posts} tags={tags} />
        </section>
      </main>
    </div>
  );
}
