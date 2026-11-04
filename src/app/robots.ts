import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

const PRIVATE = ["/cmssy-edit", "/api", "/md/"];

/** AI crawlers named explicitly so a later "*" rule can never shut them out by accident. */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "CCBot",
  "cohere-ai",
  "Bytespider",
  "DuckAssistBot",
  "MistralAI-User",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${origin}/sitemap.xml`,
  };
}
