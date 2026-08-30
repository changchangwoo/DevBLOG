import { SITE_URL } from "@/constant/const";

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Changchangwoo's blog",
    url: SITE_URL,
    description:
      "프론트엔드 개발자 이창우의 블로그입니다. React, Next.js, TypeScript를 중심으로 프론트엔드 개발 경험과 프로젝트 회고를 기록하고 있습니다.",
    author: {
      "@type": "Person",
      name: "이창우",
      url: `${SITE_URL}/about`,
    },
    inLanguage: "ko-KR",
  };
}

export function generateBlogPostingJsonLd(post: {
  title: string;
  description: string;
  date: string;
  slug: string;
  coverImage?: string;
  tag?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "이창우",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Person",
      name: "이창우",
    },
    url: `${SITE_URL}/post/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/post/${post.slug}`,
    ...(post.coverImage && {
      image: post.coverImage.startsWith("http")
        ? post.coverImage
        : `${SITE_URL}${post.coverImage}`,
    }),
    ...(post.tag &&
      post.tag.length > 0 && {
        keywords: post.tag.join(", "),
      }),
    inLanguage: "ko-KR",
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; href: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}
