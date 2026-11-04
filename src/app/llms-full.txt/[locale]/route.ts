import { respondSiteMarkdown } from "../respond";

export const revalidate = 3600;

/** `/<locale>/llms-full.txt` is rewritten here (next.config). */
export async function GET(_request: Request, props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  return respondSiteMarkdown(locale);
}
