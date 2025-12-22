import { getAllPosts } from "@/lib/posts";
import PostCard from "./components/PostCard";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background flex flex-col gap-4">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="title">울창한 숲</h1>

        <section>
          <h2 className="mb-8 text-2xl font-semibold bg-background">
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
