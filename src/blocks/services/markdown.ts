import { bullets, paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { ServicesContent } from "./Services";

export const servicesMarkdown: BlockMarkdown<ServicesContent> = (content) =>
  paragraphs(
    `## ${content.heading}`,
    ...(content.items ?? []).map((item) =>
      paragraphs(
        `### ${item.title}`,
        item.text,
        item.noteTitle && `*${item.noteTitle}*${item.noteText ? ` - ${item.noteText}` : ""}`,
        item.visual === "Etapy"
          ? (item.rows ?? []).map((r) => r.label).filter(Boolean).join(" → ")
          : bullets(item.rows ?? []),
      ),
    ),
  );
