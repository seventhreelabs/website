import type { MetadataRoute } from "next";
import { localizedPath } from "@cmssy/core/internal";
import { siteLocales } from "@/lib/cmssy/locales";
import { siteUrl } from "@/lib/site-url";
import { publishedPages } from "@/services/pages";

// Rendered per request: the page list comes from the tagged cmssy fetch cache,
// which the revalidate webhook refreshes. A prerendered route kept serving the
// stale list after a page was unpublished.
export const dynamic = "force-dynamic";

const cache = { revalidate: 3600 };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteUrl();
  const [pages, locales] = await Promise.all([publishedPages(cache), siteLocales()]);
  const url = (slug: string, locale: string) =>
    `${origin}${localizedPath(slug, locale, locales.defaultLocale)}`;

  return pages.flatMap((page) =>
    locales.locales.map((locale) => ({
      url: url(page.slug, locale),
      lastModified: new Date(page.updatedAt),
      changeFrequency: page.slug === "/" ? "weekly" : "monthly",
      priority: page.slug === "/" ? 1 : 0.5,
      alternates: {
        languages: Object.fromEntries(
          locales.locales.map((code) => [code, url(page.slug, code)]),
        ),
      },
    })),
  );
}
