import { paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { WorkProcessContent } from "./WorkProcess";

export const workProcessMarkdown: BlockMarkdown<WorkProcessContent> = (content) =>
  paragraphs(
    `## ${content.heading}`,
    content.text,
    ...(content.phases ?? []).map((phase, i) =>
      paragraphs(
        `### ${i + 1}. ${phase.title}`,
        phase.tag && `*${phase.tag}*`,
        phase.text,
        phase.result && `**${content.resultLabel || "Result"}:** ${phase.result}`,
      ),
    ),
  );
