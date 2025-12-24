import { getAllPosts, getRecentTag } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/Badge";
import Divider from "@/components/Divider";
import PostList from "./PostList";
import MainProfile from "./MainProfile";

export default function Home() {
  const posts = getAllPosts();
  const latestPost = posts[0];
  const tags = getRecentTag();

  const categoryInfo = latestPost ? getCategoryInfo(latestPost.category) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col  pt-[46px]">
      <main>
        <div className="mx-auto max-w-[120rem] flex flex-col xl:flex-row gap-[2rem] xl:gap-[5rem] px-[2rem]">
          <div className="hidden xl:block xl:flex-[1.5] xl:min-w-0">
            <MainProfile />
          </div>
          <div className="flex-1 xl:flex-[5] xl:min-w-0">
            <div className="flex flex-col gap-[2rem]">
              <section>
                <div className="flex flex-col gap-[1rem]">
                  <Divider spacing="md" label="신규" className="title2" />
                  {latestPost && (
                    <Link href={`/post/${latestPost.slug}`}>
                      <div
                        className="w-full min-h-[20rem] xl:min-h-[28rem] rounded-[8px] bg-cover bg-center relative overflow-hidden cursor-pointer group border border-boundary"
                        style={{
                          backgroundImage: latestPost.coverImage
                            ? `url(${latestPost.coverImage})`
                            : "url(/images/common/main_bg.png)",
                        }}
                      >
                        <div className="absolute inset-0 bg-black/70 group-hover:bg-black/70 transition-colors "></div>
                        <div className="relative z-10 flex flex-col justify-between p-[2rem] min-h-[20rem] xl:min-h-[28rem] border border-boundary">
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
                <Divider spacing="lg" label="포스트" className="title2" />
                <PostList posts={posts} tags={tags} />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
