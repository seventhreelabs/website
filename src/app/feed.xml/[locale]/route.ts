import { respondFeed } from "../respond";

export const revalidate = 3600;

/** `/<locale>/feed.xml` is rewritten here (next.config). */
export async function GET(_request: Request, props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  return respondFeed(locale);
}
