import Link from "next/link";
import Divider from "../common/Divider";
import Badge from "../common/Badge";
import { PostPreview } from "@/lib/posts";
import { CategoryInfo } from "@/lib/category";

interface NewPostProps {
  latestPost: PostPreview;
  categoryInfo: CategoryInfo | null;
}

export default function NewPost({ latestPost, categoryInfo }: NewPostProps) {
  return (
    <div className="flex flex-col gap-[1rem]">
      <Divider spacing="md" label="신규" className="title2" />
      {latestPost && (
        <Link href={`/post/${latestPost.slug}`}>
          <div className="w-full min-h-[20rem] xl:min-h-[28rem] rounded-[8px] relative overflow-hidden cursor-pointer group hover:opacity-80 border border-boundary transition-opacity duration-300">
            <div
              className="absolute inset-0 bg-cover bg-center  transition-transform duration-300 ease-in-out group-hover:scale-105"
              style={{
                backgroundImage: latestPost.coverImage
                  ? `url(${latestPost.coverImage})`
                  : "url(/images/common/main_bg.png)",
              }}
            />
            <div className="absolute inset-0 bg-white/60 dark:bg-black/50   " />
            <div className="relative z-10 flex flex-col justify-between p-[2rem] min-h-[20rem] xl:min-h-[28rem] border border-boundary">
              <div className="flex gap-[0.5rem] flex-wrap">
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
                <h1 className="title3 text-primary">{latestPost.title}</h1>
                <p className="body1 text-primary">{latestPost.description}</p>
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
