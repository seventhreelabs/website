import { absoluteHref, paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { PricingContent } from "./Pricing";

export const pricingMarkdown: BlockMarkdown<PricingContent> = (content, ctx) =>
  paragraphs(
    `## ${content.heading}`,
    content.text,
    (content.terms ?? []).map((t) => `*${t.text}*`).join(" · "),
    (content.stages ?? [])
      .map((s, i) => `${i + 1}. **${s.title}**${s.price ? ` - ${s.price}` : ""}${s.text ? `: ${s.text}` : ""}`)
      .join("\n"),
    ...(content.stagesNotes ?? []).map((n) => `**${n.title}** ${n.text ?? ""}`.trim()),
    content.plansHeading && `### ${content.plansHeading}`,
    content.plansText,
    ...(content.plans ?? []).map((p) =>
      paragraphs(
        `#### ${p.name}${p.tagline ? ` - ${p.tagline}` : ""}${p.badge ? ` (${p.badge})` : ""}`,
        `${p.price}${p.period ? ` ${p.period}` : ""}`,
        (p.features ?? []).map((f) => `- ${f.text}`).join("\n"),
      ),
    ),
    content.plansNote,
    ...(content.extras ?? []).map((c) =>
      `**${c.label ? `${c.label}: ` : ""}${c.title}**${c.text ? ` ${c.text}` : ""}`,
    ),
    (content.downloads ?? []).map((f) => `- [${f.label}](${absoluteHref(f.href, ctx)})`).join("\n"),
    content.disclaimer,
  );
