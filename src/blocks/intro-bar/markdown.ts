import type { BlockMarkdown } from "@/utils/markdown";
import type { IntroBarContent } from "./IntroBar";

export const introBarMarkdown: BlockMarkdown<IntroBarContent> = (content) => {
  const items = (content.items ?? []).map((i) => i.text).filter(Boolean);
  return items.length ? `*${items.join(" · ")}*` : "";
};
