import Link from "next/link";
import type { PostPreview } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import Badge from "./Badge";

interface PostCardProps {
  post: PostPreview;
  showCategory?: boolean;
}

export default function PostCard({ post, showCategory = true }: PostCardProps) {
  const categoryInfo = getCategoryInfo(post.category);

  return (
    <article className="group ">
      <Link href={`/post/${post.slug}`}>
        <div className="flex flex-col gap-[1rem]">
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
          <div className="flex items-center justify-end">
            <time className="caption text-descript">
              {new Date(post.date).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </Link>
      <div className="w-full h-[0.5px] bg-boundary my-[2rem]"></div>
    </article>
  );
}
