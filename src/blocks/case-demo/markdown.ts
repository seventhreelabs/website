import { bullets, paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { CaseDemoContent } from "./CaseDemo";

export const caseDemoMarkdown: BlockMarkdown<CaseDemoContent> = (content) =>
  paragraphs(
    `## ${content.heading}`,
    content.text,
    `### ${content.title}`,
    content.tag && `*${content.tag}*`,
    content.description,
    bullets(content.facts ?? []),
    (content.steps ?? [])
      .map((s, i) => `${i + 1}. ${s.text}${s.label ? ` (${s.label})` : ""}`)
      .join("\n"),
    content.stepsNote && `*${content.stepsNote}*`,
  );
