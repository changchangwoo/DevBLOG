import { getAllPosts, getRecentTag } from "@/lib/posts";
import PostList from "./PostList";

export default function Post() {
  const posts = getAllPosts();
  const tags = getRecentTag();

  return (
    <div className="min-h-screen bg-background pt-[46px]">
      <main className="mx-auto max-w-4xl px-6 pt-[4rem]">
        <header className="mb-[2rem]">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            포스트 
          </h1>
        </header>

        <section>
          <PostList posts={posts} tags={tags} />
        </section>
      </main>
    </div>
  );
}
