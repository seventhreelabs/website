import { siteLocales } from "@/lib/cmssy/locales";
import { llmsIndex } from "@/services/markdown";

const cache = { revalidate: 3600 };

/** llms.txt in `requested` when that language is enabled, else the default one. */
export async function respondLlmsIndex(requested?: string): Promise<Response> {
  const locales = await siteLocales();
  const locale = requested && locales.locales.includes(requested) ? requested : locales.defaultLocale;
  return new Response(await llmsIndex(locale, cache), {
    headers: { "content-type": "text/markdown; charset=utf-8", "content-language": locale },
  });
}
