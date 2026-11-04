import type { UiStrings } from "@/utils/ui-strings";

/** What a block's markdown renderer gets besides its content. */
export type MarkdownContext = {
  locale: string;
  /** Absolute site origin, no trailing slash. */
  origin: string;
  /** Absolute URL of the page being rendered, for anchors. */
  pageUrl: string;
  t: UiStrings;
  /** Site-wide values blocks read from `context.app` (posts, branding). */
  app?: Record<string, unknown>;
  /** Absolute, localized URL of a post by slug. */
  postUrl: (slug: string) => string;
};

export type BlockMarkdown<Content> = (content: Content, ctx: MarkdownContext) => string;

/** Join non-empty markdown chunks with a blank line. */
export function paragraphs(...chunks: (string | null | undefined | false)[]): string {
  return chunks.filter((c): c is string => Boolean(c && c.trim())).map((c) => c.trim()).join("\n\n");
}

/** `- label: value` lines; items without a value become plain bullets. */
export function bullets(items: { label?: string | null; value?: string | null }[]): string {
  return items
    .filter((i) => i.label)
    .map((i) => (i.value ? `- ${i.label}: ${i.value}` : `- ${i.label}`))
    .join("\n");
}

/** Resolve a cmssy link (anchor, path or absolute URL) to an absolute URL. */
export function absoluteHref(href: string | null | undefined, ctx: MarkdownContext): string {
  if (!href) return ctx.pageUrl;
  if (href.startsWith("#")) return `${ctx.pageUrl}${href}`;
  if (/^[a-z]+:/i.test(href)) return href;
  return `${ctx.origin}${href.startsWith("/") ? "" : "/"}${href}`;
}
