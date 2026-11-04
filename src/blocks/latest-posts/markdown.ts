import { LATEST_POSTS_CONTEXT_KEY, readPosts } from "@/lib/posts";
import { paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { LatestPostsContent } from "./LatestPosts";

export const latestPostsMarkdown: BlockMarkdown<LatestPostsContent> = (content, ctx) => {
  const posts = readPosts(ctx.app, LATEST_POSTS_CONTEXT_KEY);
  if (!posts.length) return "";
  return paragraphs(
    `## ${content.heading}`,
    posts.map((p) => `- [${p.title}](${ctx.postUrl(p.slug)}.md) (${p.publishedAt}): ${p.excerpt}`).join("\n"),
  );
};
