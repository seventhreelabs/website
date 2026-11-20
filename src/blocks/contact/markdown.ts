import { absoluteHref, paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { ContactContent } from "./Contact";

export const contactMarkdown: BlockMarkdown<ContactContent> = (content, ctx) =>
  paragraphs(
    `## ${content.heading}`,
    content.text,
    content.hintLabel &&
      content.hintHref &&
      `${content.hintText ? `${content.hintText} ` : ""}[${content.hintLabel}](${absoluteHref(content.hintHref, ctx)})`,
    content.email && `**${ctx.t.email}:** [${content.email}](mailto:${content.email})`,
  );
