import { htmlToMarkdown } from "@/utils/html-to-markdown";
import { paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { ContentContent } from "./Content";

export const contentMarkdown: BlockMarkdown<ContentContent> = (content) =>
  paragraphs(`# ${content.heading}`, content.lead, htmlToMarkdown(content.body));
