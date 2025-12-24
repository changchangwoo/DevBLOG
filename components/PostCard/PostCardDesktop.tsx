import Link from "next/link";
import type { PostPreview } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import Badge from "../Badge";

interface PostCardDesktopProps {
  post: PostPreview;
  showCategory?: boolean;
}

export default function PostCardDesktop({
  post,
  showCategory = true,
}: PostCardDesktopProps) {
  const categoryInfo = getCategoryInfo(post.category);

  return (
    <article className="group">
      <Link href={`/post/${post.slug}`}>
        <div className="flex flex-col h-full rounded-lg border border-boundary bg-secondary overflow-hidden transition-all hover:shadow-lg hover:border-primary">
          {/* 이미지 영역 */}
          <div
            className="w-full h-[200px] bg-cover bg-center"
            style={{
              backgroundImage: post.coverImage
                ? `url(${post.coverImage})`
                : "url(/images/common/default_post.png)",
            }}
          />

          {/* 컨텐츠 영역 */}
          <div className="flex flex-col gap-[1rem] p-[2rem] flex-1">
            <div className="flex items-center justify-start">
              <time className="caption text-descript">
                {new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            <h3 className="title2 text-primary line-clamp-2">{post.title}</h3>

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

            <p className="body1 text-descript line-clamp-3">{post.excerpt}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
