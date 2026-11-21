import { absoluteHref, paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { HeroContent } from "./Hero";

export const heroMarkdown: BlockMarkdown<HeroContent> = (content, ctx) => {
  const actions = (content.actions ?? [])
    .filter((a) => a.label)
    .map((a) => `- [${a.label}](${absoluteHref(a.href, ctx)})`)
    .join("\n");

  return paragraphs(
    content.eyebrow && `*${content.eyebrow}*`,
    `# ${content.heading.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).join(" ")}`,
    content.text,
    actions,
    content.note && `*${content.note}*`,
  );
};
