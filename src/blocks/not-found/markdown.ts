import { absoluteHref, paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { NotFoundContent } from "./NotFound";

export const notFoundMarkdown: BlockMarkdown<NotFoundContent> = (content, ctx) =>
  paragraphs(
    `# ${content.code ? `${content.code}: ` : ""}${content.heading}`,
    content.text,
    content.ctaLabel && `[${content.ctaLabel}](${absoluteHref(content.ctaHref, ctx)})`,
  );
