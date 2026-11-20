import { absoluteHref, paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { ProcessAnalyzerContent } from "./ProcessAnalyzer";

/** The tool itself needs a browser; agents get the pitch, the services and the CTA. */
export const processAnalyzerMarkdown: BlockMarkdown<ProcessAnalyzerContent> = (content, ctx) =>
  paragraphs(
    `## ${content.heading}`,
    content.text,
    content.inputLabel && `*${content.inputLabel}: ${ctx.pageUrl}${content.anchor ? `#${content.anchor}` : ""}*`,
    ...(content.services ?? []).map((service) =>
      paragraphs(
        `### ${service.name}`,
        service.description,
        service.href && `[${service.linkLabel || service.name}](${absoluteHref(service.href, ctx)})`,
      ),
    ),
    content.ctaLabel && content.ctaHref && `[${content.ctaLabel}](${absoluteHref(content.ctaHref, ctx)})`,
  );
