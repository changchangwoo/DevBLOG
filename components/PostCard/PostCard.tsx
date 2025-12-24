import type { PostPreview } from "@/lib/posts";
import PostCardDesktop from "./PostCardDesktop";
import PostCardMobile from "./PostCardMobile";

interface PostCardProps {
  post: PostPreview;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div>
      <div className="hidden xl:block">
        <PostCardDesktop post={post} />
      </div>
      <div className="block xl:hidden">
        <PostCardMobile post={post} />
      </div>
    </div>
  );
}
