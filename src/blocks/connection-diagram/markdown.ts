import { paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { ConnectionDiagramContent } from "./ConnectionDiagram";

export const connectionDiagramMarkdown: BlockMarkdown<ConnectionDiagramContent> = (content) =>
  paragraphs(
    `## ${content.heading}`,
    content.text,
    ...(content.nodes ?? []).map((node) =>
      paragraphs(`**${node.title}**`, (node.items ?? []).map((i) => `- ${i.text}`).join("\n")),
    ),
  );
