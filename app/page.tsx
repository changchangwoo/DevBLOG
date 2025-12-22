import { getAllPosts } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import PostCard from "./components/PostCard";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();
  const latestPost = posts[0];
  const categoryInfo = latestPost ? getCategoryInfo(latestPost.category) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col gap-4">
      <main className="">
        <div
          className="w-full min-h-[24rem] rounded-lg bg-cover bg-center flex flex-col p-[2rem] justify-end "
          style={{ backgroundImage: "url(/images/common/main_bg.png)" }}
        >
          <h1 className="title1 text-white mb-2">울창한 숲</h1>
          <h2 className="body1 text-white">프론트엔드 개발자 이창우 블로그</h2>
        </div>
        <div className="p-[1rem]">
          <section>
            <div className="flex flex-col gap-[1rem]">
              <h1 className="body text-primary body1">최신 포스트</h1>
              {latestPost && (
                <Link href={`/post/${latestPost.slug}`}>
                  <div
                    className="w-full min-h-[22rem] rounded-lg bg-cover bg-center relative overflow-hidden cursor-pointer group"
                    style={{
                      backgroundImage: latestPost.coverImage
                        ? `url(${latestPost.coverImage})`
                        : "url(/images/common/main_bg.png)",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/80 group-hover:bg-black/70 transition-colors"></div>
                    <div className="relative z-10 flex flex-col justify-between p-[2rem] min-h-[22rem]">
                      <div className="flex gap-[0.5rem]">
                        {categoryInfo && (
                          <div className={`caption ${categoryInfo.colorClass} px-3 rounded-[10px] text-white`}>
                            {categoryInfo.label}
                          </div>
                        )}
                        {latestPost.tag.map((tag) => (
                          <div
                            key={latestPost.slug + tag}
                            className="caption bg-secondary px-3 rounded-[10px]"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                      <div>
                        <h1 className="title2 text-white">
                          {latestPost.title}
                        </h1>
                        <h2 className="body1 text-descript">
                          {latestPost.excerpt}
                        </h2>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </section>
          <section>
            <div className="space-y-12">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} showCategory={true} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
