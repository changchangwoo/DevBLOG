import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, markdownToHtml } from "@/lib/posts";
import { extractHeadings } from "@/lib/toc";
import TableOfContents from "@/app/components/TableOfContents";

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
  console.log(slug);
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

export default async function AboutPage({ params }: PostPageProps) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">hello World</div>
  );
}
