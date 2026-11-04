import { absoluteHref, paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { HeroContent } from "./Hero";

export const heroMarkdown: BlockMarkdown<HeroContent> = (content, ctx) => {
  const actions = (content.actions ?? [])
    .filter((a) => a.label)
    .map((a) => `- [${a.label}](${absoluteHref(a.href, ctx)})`)
    .join("\n");
  const flows = (content.flows ?? [])
    .map((flow) => {
      const steps = (flow.steps ?? [])
        .map((s, i) => `${i + 1}. ${s.text} (${s.actor === "Człowiek" ? ctx.t.actorHuman : ctx.t.actorAgent})`)
        .join("\n");
      return paragraphs(`**${flow.label}**`, steps);
    })
    .join("\n\n");

  return paragraphs(
    `# ${content.heading}`,
    content.text,
    actions,
    flows && `## ${ctx.t.sampleProcesses}`,
    flows,
    content.flowNote && `*${content.flowNote}*`,
  );
};
