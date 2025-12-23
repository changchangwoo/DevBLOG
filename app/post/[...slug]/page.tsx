import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, markdownToHtml } from "@/lib/posts";
import { extractHeadings } from "@/lib/toc";
import { getCategoryInfo } from "@/lib/category";
import TableOfContents from "@/app/components/TableOfContents";
import Badge from "@/app/components/Badge";
import Image from "next/image";
import Divider from "@/app/components/Divider";

interface PostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const slugString = slug.join("/");
  const post = getPostBySlug(slugString);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | ChangWoo의 블로그`,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const slugString = slug.join("/");

  let post;
  try {
    post = getPostBySlug(slugString);
  } catch (error) {
    notFound();
  }

  const content = await markdownToHtml(post.content);
  const headings = extractHeadings(post.content);
  const categoryInfo = getCategoryInfo(post.category);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl">
            {post.coverImage && (
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  width={2400}
                  height={180}
                  className="w-full min-h-[18rem] border object-cover"
                />
              )}
          <article className="flex-1 min-w-0 p-[2rem]">
            <header className="flex flex-col gap-[1rem]">
              <div className="flex items-center gap-3">
                <time className="body3 text-descript ">
                  {new Date(post.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>

              <h1 className="title3 text-primary">
                {post.title}
              </h1>
              <p className="body1 text-descript">
                {post.excerpt}
              </p>
                            <div className="flex gap-[0.5rem]">
                {categoryInfo && (
                  <Badge variant="category" colorClass={categoryInfo.colorClass}>
                    {categoryInfo.label}
                  </Badge>
                )}
                {post.tag &&
                  post.tag.map((tag) => (
                    <Badge key={`${post.slug}-${tag}`}>{tag}</Badge>
                  ))}
              </div>
            </header>
            <Divider spacing="lg" />

            <div
              className="
              prose max-w-none
              prose-img:w-full
              prose-img:h-auto
              prose-img:rounded-2xl
              prose-img:border
              prose-img:border-zinc-200
              dark:prose-img:border-zinc-800
              dark:prose-invert
              "
              dangerouslySetInnerHTML={{ __html: content }}
            />


          </article>
          <aside className="hidden xl:block absolute left-full top-16 h-full">
            <div className="sticky top-24 w-64">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </div>
  );
}
