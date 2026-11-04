import type { BlockMarkdown } from "@/utils/markdown";
import type { TechMarqueeContent } from "./TechMarquee";

export const techMarqueeMarkdown: BlockMarkdown<TechMarqueeContent> = (content, ctx) => {
  const names = (content.items ?? []).map((i) => i.name).filter(Boolean);
  return names.length ? `**${ctx.t.technologies}:** ${names.join(", ")}` : "";
};
