import { bullets, paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { BookingContent } from "./Booking";

export const bookingMarkdown: BlockMarkdown<BookingContent> = (content) =>
  paragraphs(
    `## ${content.heading}`,
    content.text,
    bullets(content.facts ?? []),
    content.embedUrl ? `[${content.embedTitle || content.embedUrl}](${content.embedUrl})` : content.fallbackText,
    content.email && `[${content.email}](mailto:${content.email})`,
    content.prepareHeading && `### ${content.prepareHeading}`,
    (content.prepare ?? []).map((p, i) => `${i + 1}. **${p.strong}** ${p.text ?? ""}`.trim()).join("\n"),
  );
