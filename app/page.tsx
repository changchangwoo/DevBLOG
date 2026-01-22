import { getAllPosts, getAllTag, getPinnedPost } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import Divider from "@/components/common/Divider";
import PostList from "../components/home/PostList";
import PageLayout from "@/components/layout/PageLayout";
import { Suspense } from "react";
import PinnedPost from "@/components/home/PinnedPost";

export const metadata = {
  alternates: {
    canonical: "https://www.changchangwoo.com/",
  },
};

export default function Home() {
  const posts = getAllPosts();
  const pinnedPost = getPinnedPost();
  const tags = getAllTag();
  const categoryInfo = pinnedPost ? getCategoryInfo(pinnedPost.category) : null;

  return (
    <PageLayout>
      <section>
        <PinnedPost pinnedPost={pinnedPost} categoryInfo={categoryInfo} />
      </section>
      <section>
        <Divider label={`포스트`} className="title2 mb-[2rem]" />
        <Suspense>
          <PostList posts={posts} tags={tags} />
        </Suspense>
      </section>
    </PageLayout>
  );
}
