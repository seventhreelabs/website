import { paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { OfferGridContent } from "./OfferGrid";

export const offerGridMarkdown: BlockMarkdown<OfferGridContent> = (content) =>
  paragraphs(
    `## ${content.heading}`,
    content.text,
    ...(content.items ?? []).map((item) =>
      paragraphs(`### ${item.title}`, item.text, item.tag && `*${item.tag}*`),
    ),
    content.note,
  );
