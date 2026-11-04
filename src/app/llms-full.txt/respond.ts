import { siteLocales } from "@/lib/cmssy/locales";
import { siteMarkdown } from "@/services/markdown";

const cache = { revalidate: 3600 };

/** The whole site as one markdown file in `requested` when enabled, else the default language. */
export async function respondSiteMarkdown(requested?: string): Promise<Response> {
  const locales = await siteLocales();
  const locale = requested && locales.locales.includes(requested) ? requested : locales.defaultLocale;
  return new Response(await siteMarkdown(locale, cache), {
    headers: { "content-type": "text/markdown; charset=utf-8", "content-language": locale },
  });
}
