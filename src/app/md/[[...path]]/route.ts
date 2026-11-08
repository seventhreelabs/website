import { localizedPath, splitLocaleFromPath } from "@cmssy/core/internal";
import { siteLocales } from "@/lib/cmssy/locales";
import { siteUrl, slugFromPath } from "@/lib/site-url";
import { pageMarkdown } from "@/services/markdown";

export const revalidate = 3600;
const cache = { revalidate };

/**
 * Markdown twin of every page. Reached through the rewrites in next.config:
 * `/<path>.md` (`/index.md` for the home page) and any request that sends
 * `Accept: text/markdown`.
 */
export async function GET(_request: Request, props: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await props.params;
  const locales = await siteLocales();
  const raw = path.map((segment, i) => (i === path.length - 1 ? segment.replace(/\.md$/, "") : segment));
  const { locale, path: pagePath } = splitLocaleFromPath(raw, locales);
  const segments = (pagePath ?? []).filter((s) => s && s !== "index");
  const slug = slugFromPath(segments);
  const markdown = await pageMarkdown(slug, locale, cache);

  if (!markdown) return new Response("Not found\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  // the HTML page is canonical: search engines index that one, not its twin
  const canonical = `${siteUrl()}${localizedPath(slug, locale, locales.defaultLocale)}`;
  return new Response(markdown + "\n", {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "content-language": locale,
      vary: "Accept",
      link: `<${canonical}>; rel="canonical"`,
      "x-robots-tag": "noindex",
    },
  });
}
