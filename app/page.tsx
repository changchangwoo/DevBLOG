import { getAllPosts, getRecentTag, getAllCategories } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import Divider from "@/components/common/Divider";
import PostList from "../components/home/PostList";
import NewPost from "../components/home/NewPost";
import PageLayout from "@/components/layout/PageLayout";
import { Suspense } from "react";

export default function Home() {
  const posts = getAllPosts();
  const latestPost = posts[0];
  const tags = getRecentTag();
  const categoryInfo = latestPost ? getCategoryInfo(latestPost.category) : null;

  return (
    <PageLayout>
      <section>
        <NewPost latestPost={latestPost} categoryInfo={categoryInfo} />
      </section>
      <section>
        <Divider spacing="md" label={`포스트`} className="title2" />
        <Suspense>
          <PostList posts={posts} tags={tags} />
        </Suspense>
      </section>
    </PageLayout>
  );
}
