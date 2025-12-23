import { getAllPosts } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import PostCard from "./components/PostCard";
import Badge from "./components/Badge";
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
        <div className="p-[2rem] flex flex-col gap-[2rem]">
          <section>
            <div className="flex flex-col gap-[1rem]">
              <div className="flex items-center gap-[20px] mb-[1rem]">
                <h1 className="body text-primary body2 whitespace-nowrap">
                  새로운 아티클
                </h1>
                <div className="w-full h-[0.5px] bg-boundary"></div>
              </div>
              {latestPost && (
                <Link href={`/post/${latestPost.slug}`}>
                  <div
                    className="w-full min-h-[20rem] rounded-[8px] bg-cover bg-center relative overflow-hidden cursor-pointer group border border-boundary"
                    style={{
                      backgroundImage: latestPost.coverImage
                        ? `url(${latestPost.coverImage})`
                        : "url(/images/common/main_bg.png)",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/70 group-hover:bg-black/70 transition-colors "></div>
                    <div className="relative z-10 flex flex-col justify-between p-[2rem] min-h-[20rem] border border-boundary">
                      <div className="flex gap-[0.5rem]">
                        {categoryInfo && (
                          <Badge
                            variant="category"
                            colorClass={categoryInfo.colorClass}
                          >
                            {categoryInfo.label}
                          </Badge>
                        )}
                        {latestPost.tag.map((tag) => (
                          <Badge key={latestPost.slug + tag}>{tag}</Badge>
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
            <div className="flex flex-col gap-[1rem]">
              <div className="flex items-center gap-[20px] mb-[1rem]">
                <h1 className="body text-primary body2 whitespace-nowrap">
                  최신 아티클
                </h1>
                <div className="w-full h-[0.5px] bg-boundary"></div>
              </div>
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
