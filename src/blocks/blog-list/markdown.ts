import { POSTS_CONTEXT_KEY, readPosts } from "@/lib/posts";
import { paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { BlogListContent } from "./BlogList";

export const blogListMarkdown: BlockMarkdown<BlogListContent> = (content, ctx) =>
  paragraphs(
    `# ${content.heading}`,
    content.intro,
    readPosts(ctx.app, POSTS_CONTEXT_KEY)
      .map((p) => `- [${p.title}](${ctx.postUrl(p.slug)}.md) (${p.publishedAt}): ${p.excerpt}`)
      .join("\n"),
  );
