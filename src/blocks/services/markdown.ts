import { paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { ServicesContent } from "./Services";

export const servicesMarkdown: BlockMarkdown<ServicesContent> = (content) =>
  paragraphs(
    `## ${content.heading}`,
    content.text,
    ...(content.items ?? []).map((item) => paragraphs(`### ${item.title}`, item.text)),
  );
