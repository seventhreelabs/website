import { paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { FaqContent } from "./Faq";

export const faqMarkdown: BlockMarkdown<FaqContent> = (content) =>
  paragraphs(
    `## ${content.heading}`,
    ...(content.items ?? []).map((i) => paragraphs(`### ${i.question}`, i.answer)),
  );
