import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, markdownToHtml } from "@/lib/posts";
import { extractHeadings } from "@/lib/toc";
import { getCategoryInfo } from "@/lib/category";
import TableOfContents from "@/components/TableOfContents";
import Badge from "@/components/Badge";
import Image from "next/image";
import Divider from "@/components/Divider";
import Giscus from "@/components/Giscus";
import IconWithLabel from "@/components/IconWithLabel";

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
    <div className="min-h-screen bg-background pt-[46px]">
      <div className="relative mx-auto max-w-7xl pb-[3rem]">
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

            <h1 className="title3 text-primary">{post.title}</h1>
            <p className="body1 text-descript">{post.excerpt}</p>
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
        <div className="px-[1rem] md:px-[2rem] flex flex-col gap-[2rem]">
          <Divider spacing="none" />
          <div className="p-[2rem] rounded-[8px] bg-secondary flex flex-col gap-[1rem]">
            <div className="flex gap-[1rem]">
              <Image
                width={40}
                height={40}
                src={"/images/common/profile_img.png"}
                alt="프로필 이미지"
              />
              <div className="flex flex-col">
                <span className="body1 text-primary">이창우</span>
                <span className="body3 text-descript">프론트엔드 개발자</span>
              </div>
            </div>
            <h3 className="body3 text-descript">
              <strong>프로젝트를 좋아하는 주니어 개발자</strong>입니다.
              <br />
              부족하더라도 항상 씩씩한 사람이 되고 싶습니다.
            </h3>
            <div className="flex gap-[1rem] justify-start mt-[1rem] relative">
              <IconWithLabel
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                }
                label="GitHub"
                href="https://github.com/changchangwoo"
                target="_blank"
                rel="noopener noreferrer"
              />
              <IconWithLabel
                icon={
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-10 7L2 7" />
                  </svg>
                }
                label="Email"
                href="mailto:changchangwoo@naver.com"
              />
            </div>
          </div>
          <div className="text-center">
            <h1 className="caption text-descript">
              반응을 주시면 정말 큰 힘이 될 것 같아요!
            </h1>
          </div>
          <Giscus />
        </div>
        {/* PC버전 테이블 */}
        <aside className="hidden xl:block absolute left-full top-[44rem] min-h-[calc(100%-44rem)]">
          <div className="sticky top-24 w-[32rem]">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}
