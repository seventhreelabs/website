import { paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { WorkProcessContent } from "./WorkProcess";

export const workProcessMarkdown: BlockMarkdown<WorkProcessContent> = (content) =>
  paragraphs(
    `## ${content.heading}`,
    ...(content.phases ?? []).map((phase, i) =>
      paragraphs(
        `### ${i + 1}. ${phase.title}`,
        phase.text,
        phase.result && `**${content.resultLabel || "Result"}:** ${phase.result}`,
      ),
    ),
  );
