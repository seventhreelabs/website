import { absoluteHref, paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { ShowcaseContent } from "./Showcase";

export const showcaseMarkdown: BlockMarkdown<ShowcaseContent> = (content, ctx) =>
  paragraphs(
    `## ${content.heading}`,
    content.text,
    ...(content.items ?? []).map((item) =>
      paragraphs(
        `### ${item.title}${item.kicker ? ` (${item.kicker})` : ""}`,
        item.text,
        (item.tags ?? []).map((t) => t.name).filter(Boolean).join(", "),
        item.href && item.linkLabel && `[${item.linkLabel}](${absoluteHref(item.href, ctx)})`,
      ),
    ),
  );
