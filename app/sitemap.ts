import { MetadataRoute } from "next";
import { getAllCategories, getAllPosts, getAllTag } from "@/lib/posts";
import { getAvailableYears, getCurrentYear } from "@/lib/til";
import { SITE_URL } from "@/constant/const";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const availableYears = getAvailableYears();
  const defaultTilYear = availableYears[0] ?? getCurrentYear();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/posts`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/til`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const posts = getAllPosts();
  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/post/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const categoryPages: MetadataRoute.Sitemap = getAllCategories().map((category) => ({
    url: `${SITE_URL}/posts/category/${encodeURIComponent(category.name)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const tagPages: MetadataRoute.Sitemap = getAllTag().map((tag) => ({
    url: `${SITE_URL}/posts/tag/${encodeURIComponent(tag.name)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const tilYearPages: MetadataRoute.Sitemap = availableYears
    .filter((year) => year !== defaultTilYear)
    .map((year) => ({
      url: `${SITE_URL}/til/${year}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

  return [...staticPages, ...postPages, ...categoryPages, ...tagPages, ...tilYearPages];
}
