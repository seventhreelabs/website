import { splitLocaleFromPath } from "@cmssy/core/internal";
import { siteLocales } from "@/lib/cmssy/locales";
import { slugFromPath } from "@/lib/site-url";
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
  const markdown = await pageMarkdown(slugFromPath(segments), locale, cache);

  if (!markdown) return new Response("Not found\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8" } });
  return new Response(markdown + "\n", {
    headers: { "content-type": "text/markdown; charset=utf-8", "content-language": locale, vary: "Accept" },
  });
}
