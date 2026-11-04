import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";
import { publishedPages } from "@/services/pages";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const pages = await publishedPages();

  return pages.map((page) => ({
    url: `${origin}${page.slug === "/" ? "" : page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: page.slug === "/" ? "weekly" : "monthly",
    priority: page.slug === "/" ? 1 : 0.5,
  }));
}
