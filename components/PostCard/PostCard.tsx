import Link from "next/link";
import Image from "next/image";
import type { PostPreview } from "@/lib/posts";
import { getCategoryInfo } from "@/lib/category";
import Badge from "../Badge";
import Divider from "../Divider";

interface PostCardProps {
  post: PostPreview;
}

export default function PostCard({ post }: PostCardProps) {
  const categoryInfo = getCategoryInfo(post.category);

  return (
    <article className="group">
      <Link href={`/post/${post.slug}`} className="block">
        <div className="flex flex-col gap-[1rem]">
          {post.coverImage && (
            <div className="hidden md:block relative w-full min-h-[200px] overflow-hidden rounded-[8px] ">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover border border-boundary"
              />
            </div>
          )}
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
            <h3 className="title2 text-primary">{post.title}</h3>
          </div>
          <div className="flex flex-wrap gap-[0.5rem]">
            <Badge variant="category" colorClass={categoryInfo.colorClass}>
              {categoryInfo.label}
            </Badge>
            {post.tag.map((tag) => (
              <Badge key={post.slug + tag}>{tag}</Badge>
            ))}
          </div>
          <p className="body1 text-descript">{post.excerpt}</p>
        </div>
      </Link>
      <Divider spacing="lg" className="block md:hidden" />
    </article>
  );
}
