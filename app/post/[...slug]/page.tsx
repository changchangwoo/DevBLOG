import { notFound } from "next/navigation";
import { getAllPosts, getCoverBlur, getPostBySlug } from "@/lib/posts";
import { renderMarkdown, type TocHeading } from "@/lib/markdown";
import { getCategoryInfo, type CategoryInfo } from "@/lib/category";
import TableOfContents from "@/components/post-detail/TableOfContents";
import Badge from "@/components/common/Badge";
import Image from "next/image";
import Divider from "@/components/common/Divider";
import Giscus from "@/components/post-detail/Giscus";
import IconWithLabel from "@/components/common/IconWithLabel";
import ScrollProgressBar from "@/components/post-detail/ScrollProgressBar";
import { AUTHOR_INFO } from "@/constant/const";
import { generateBlogPostingJsonLd, generateBreadcrumbJsonLd } from "@/lib/jsonld";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

function renderPostHeader(
  title: string,
  date: string,
  description: string,
  categoryInfo: CategoryInfo | null,
  tags: string[],
  slug: string,
) {
  return (
    <>
      <header className="flex flex-col gap-[1rem]">
        <div className="flex items-center">
          <time className="body3 text-descript" dateTime={new Date(date).toISOString()}>
            {new Date(date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <div>
          <h1 className="title3 text-primary">{title}</h1>
          <p className="body1 text-descript mt-[0.5rem]">{description}</p>
        </div>
        <div className="flex gap-[0.5rem]">
          {categoryInfo && (
            <Link href={`/posts/category/${encodeURIComponent(slug.split("/")[0])}`}>
              <Badge variant="category" colorClass={categoryInfo.colorClass}>
                {categoryInfo.label}
              </Badge>
            </Link>
          )}
          {tags &&
            tags.map((tag) => (
              <Link key={`${slug}-${tag}`} href={`/posts/tag/${encodeURIComponent(tag)}`}>
                <Badge>{tag}</Badge>
              </Link>
            ))}
        </div>
      </header>
      <Divider spacing="lg" />
    </>
  );
}

function renderPostContent(html: string) {
  return (
    <div
      className="
        prose max-w-none
        prose-img:w-full
        prose-img:h-auto
        prose-img:rounded-2xl
        prose-img:border
        prose-img:border-boundary
        dark:prose-invert
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function renderAuthorProfile() {
  return (
    <div className="p-[2rem] rounded-[8px] bg-secondary flex flex-col gap-[1rem]">
      <div className="flex gap-[1rem]">
        <Image
          width={40}
          height={40}
          src={AUTHOR_INFO.profileImage}
          alt="프로필 이미지"
        />
        <div className="flex flex-col">
          <span className="body1 text-primary">{AUTHOR_INFO.name}</span>
          <span className="body3 text-descript">{AUTHOR_INFO.role}</span>
        </div>
      </div>
      <div className="body3 text-descript">
        <strong>프로젝트를 좋아하는 주니어 개발자</strong>입니다.
        <br />
        부족하더라도 항상 씩씩한 사람이 되고 싶습니다.
      </div>
      <div className="flex gap-[1rem] justify-start mt-[1rem] relative">
        {AUTHOR_INFO.links.github && (
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
            href={AUTHOR_INFO.links.github}
            target="_blank"
            rel="noopener noreferrer"
          />
        )}
        {AUTHOR_INFO.links.email && (
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
            href={AUTHOR_INFO.links.email}
          />
        )}
      </div>
    </div>
  );
}

function renderPostFooter() {
  return (
    <div className="px-[1rem] md:px-[2rem] flex flex-col gap-[2rem]">
      <Divider spacing="none" />
      {renderAuthorProfile()}
      <div className="text-center caption text-descript">
        반응을 주시면 정말 큰 힘이 될 것 같아요! 🌱
      </div>
      <Giscus />
    </div>
  );
}

function renderTableOfContents(headings: TocHeading[]) {
  return (
    <aside className="hidden xl:block absolute left-full top-[44rem] min-h-[calc(100%-44rem)]">
      <div className="sticky top-[12rem] w-[32rem]">
        <TableOfContents headings={headings} />
      </div>
    </aside>
  );
}

// ===== Next.js 함수들 =====

export const dynamicParams = false;

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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${post.title}`,
    description: post.description,
    keywords: [
      post.title,
      ...post.tag,
      post.category,
      "프론트엔드 블로그",
      "개발 블로그",
    ],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `/post/${slugString}`,
      publishedTime: post.date,
      tags: post.tag,
      images: post.coverImage
        ? [
            {
              url: post.coverImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: {
      canonical: `/post/${slugString}`,
    },
  };
}

// ===== 메인 컴포넌트 =====

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const slugString = slug.join("/");

  const post = getPostBySlug(slugString);

  if (!post) {
    notFound();
  }

  // 본문과 목차를 한 번의 파싱에서 함께 얻는다 (heading id가 항상 일치)
  const { html: content, headings } = await renderMarkdown(post.content, {
    category: post.category,
    collectHeadings: true,
  });
  const categoryInfo = getCategoryInfo(post.category);
  const coverBlur = await getCoverBlur(post.coverImage);

  const blogPostingJsonLd = generateBlogPostingJsonLd({
    title: post.title,
    description: post.description,
    date: post.date,
    slug: post.slug,
    coverImage: post.coverImage,
    tag: post.tag,
  });

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "홈", href: "/" },
    { name: categoryInfo?.label || post.category, href: `/posts/category/${encodeURIComponent(post.category)}` },
    { name: post.title, href: `/post/${post.slug}` },
  ]);

  return (
    <div className="min-h-screen bg-background ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <ScrollProgressBar />
      <div className="relative mx-auto max-w-7xl">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            width={2400}
            height={180}
            sizes="(min-width: 800px) 800px, 100vw"
            priority
            {...(coverBlur
              ? { placeholder: "blur" as const, blurDataURL: coverBlur }
              : {})}
            className="w-full min-h-[18rem] border object-cover"
          />
        )}
        <article
          className={`flex-1 min-w-0 p-[2rem] ${
            !post.coverImage ? "pt-[7.4rem]" : ""
          }`}
        >
          {renderPostHeader(
            post.title,
            post.date,
            post.description,
            categoryInfo,
            post.tag,
            post.slug,
          )}
          {renderPostContent(content)}
        </article>
        {renderPostFooter()}
        {renderTableOfContents(headings)}
      </div>
    </div>
  );
}
