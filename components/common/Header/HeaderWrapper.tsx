import { getAllCategories, getRecentTag, getAllPosts } from "@/lib/posts";
import Header from "./Header";

export default function HeaderWrapper() {
  const categories = getAllCategories();
  const tags = getRecentTag();
  const posts = getAllPosts();

  return <Header categories={categories} tags={tags} posts={posts} />;
}
