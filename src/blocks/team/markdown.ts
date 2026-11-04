import { paragraphs, type BlockMarkdown } from "@/utils/markdown";
import type { TeamContent } from "./Team";

export const teamMarkdown: BlockMarkdown<TeamContent> = (content, ctx) =>
  paragraphs(
    `## ${content.heading}`,
    ...(content.members ?? []).map((m) =>
      paragraphs(
        `### ${m.name}${m.role ? ` - ${m.role}` : ""}`,
        m.bio,
        m.profileUrl && `[${ctx.t.profile}](${m.profileUrl})`,
      ),
    ),
  );
