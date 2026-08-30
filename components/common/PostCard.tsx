import Link from "next/link";
import Image from "next/image";
import type { PostSummary } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import Badge from "./Badge";
import Divider from "./Divider";

interface PostCardProps {
  post: PostSummary;
  /** 빌드 타임 생성 블러. 서버 렌더 목록에서만 전달된다. */
  blurDataURL?: string;
}

export default function PostCard({ post, blurDataURL }: PostCardProps) {
  const categoryInfo = getCategoryInfo(post.category);

  return (
    <article className="group transition-opacity duration-300 ease-in-out hover:opacity-70">
      <Link href={`/post/${post.slug}`} className="block">
        <div className="flex flex-col gap-[1rem]">
          <div className="hidden md:block relative w-full min-h-[200px] overflow-hidden rounded-[8px]">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(min-width: 1280px) 420px, 50vw"
                {...(blurDataURL
                  ? { placeholder: "blur" as const, blurDataURL }
                  : {})}
                className="object-cover border border-boundary transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
            ) : (
              <div className="caption text-descript border border-boundary flex items-center justify-center bg-secondary min-h-[200px]">
                none thumnail
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-start">
              <time className="caption text-descript">
                {new Date(post.date).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
            <span className="title2 text-primary">{post.title}</span>
          </div>
          <div className="flex flex-wrap gap-[0.5rem]">
            <Badge variant="category" colorClass={categoryInfo.colorClass}>
              {categoryInfo.label}
            </Badge>
            {post.tag.map((tag) => (
              <Badge key={post.slug + tag}>{tag}</Badge>
            ))}
          </div>
          <p className="body1 text-descript">{post.description}</p>
        </div>
      </Link>
      <Divider spacing="lg" className="block md:hidden" />
    </article>
  );
}
