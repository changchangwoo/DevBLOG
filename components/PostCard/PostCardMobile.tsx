import Link from "next/link";
import type { PostPreview } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import Badge from "../Badge";
import Divider from "../Divider";

interface PostCardMobileProps {
  post: PostPreview;
  showCategory?: boolean;
}

export default function PostCardMobile({
  post,
  showCategory = true,
}: PostCardMobileProps) {
  const categoryInfo = getCategoryInfo(post.category);

  return (
    <article className="group">
      <Link href={`/post/${post.slug}`}>
        <div className="flex flex-col gap-[1rem]">
          <div className="flex items-center justify-start">
            <time className="caption text-descript">
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <h3 className="title2 text-primary">{post.title}</h3>
          <div className="flex flex-wrap gap-[0.5rem]">
            {showCategory && (
              <Badge variant="category" colorClass={categoryInfo.colorClass}>
                {categoryInfo.label}
              </Badge>
            )}
            {post.tag.map((tag) => (
              <Badge key={post.slug + tag}>{tag}</Badge>
            ))}
          </div>
          <p className="body1 text-descript">{post.excerpt}</p>
        </div>
      </Link>
      <Divider spacing="lg" />
    </article>
  );
}
