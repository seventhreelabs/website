import { paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { ContactContent } from "./Contact";

export const contactMarkdown: BlockMarkdown<ContactContent> = (content, ctx) =>
  paragraphs(
    `## ${content.heading}`,
    content.text,
    content.email && `**${ctx.t.email}:** [${content.email}](mailto:${content.email})`,
  );
