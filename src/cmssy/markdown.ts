import { blogListMarkdown } from "@/blocks/blog-list/markdown";
import { connectionDiagramMarkdown } from "@/blocks/connection-diagram/markdown";
import { contactMarkdown } from "@/blocks/contact/markdown";
import { contentMarkdown } from "@/blocks/content/markdown";
import { faqMarkdown } from "@/blocks/faq/markdown";
import { heroMarkdown } from "@/blocks/hero/markdown";
import { latestPostsMarkdown } from "@/blocks/latest-posts/markdown";
import { notFoundMarkdown } from "@/blocks/not-found/markdown";
import { servicesMarkdown } from "@/blocks/services/markdown";
import { teamMarkdown } from "@/blocks/team/markdown";
import { techMarqueeMarkdown } from "@/blocks/tech-marquee/markdown";
import { workProcessMarkdown } from "@/blocks/work-process/markdown";
import type { BlockMarkdown } from "@/utils/markdown";

/**
 * Markdown renderer per block type - the text twin of `blocks.ts`. Layout
 * blocks (header, footer) have none: navigation is noise for a reader.
 * A section block without a renderer is skipped in `.md` and llms files.
 */
export const blockMarkdown: Record<string, BlockMarkdown<never>> = {
  hero: heroMarkdown,
  "tech-marquee": techMarqueeMarkdown,
  services: servicesMarkdown,
  "connection-diagram": connectionDiagramMarkdown,
  "work-process": workProcessMarkdown,
  team: teamMarkdown,
  faq: faqMarkdown,
  contact: contactMarkdown,
  content: contentMarkdown,
  "not-found": notFoundMarkdown,
  "blog-list": blogListMarkdown,
  "latest-posts": latestPostsMarkdown,
};
