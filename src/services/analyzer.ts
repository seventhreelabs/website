"use server";

import { headers } from "next/headers";
import { groqClient } from "@/lib/analyzer/groq";
import { checkAnalyzerLimits } from "@/lib/analyzer/rate-limit";
import { verifyTurnstile } from "@/lib/analyzer/turnstile";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  analyzerRequest,
  cleanServices,
  readAnalysis,
  type AnalyzerResult,
  type AnalyzerService,
} from "@/utils/process-analysis";

type AnalyzeInput = {
  description: string;
  services: AnalyzerService[];
  locale: string;
  turnstileToken: string;
  /** Honeypot - real visitors leave it empty. */
  website: string;
};

/** Visitor's IP as Vercel's edge reports it. */
async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

/**
 * The analyzer's only entry point. Order matters: cheap checks first, the
 * captcha before the rate limit (bots don't eat visitors' quota), the model last.
 */
export async function analyzeProcess(input: AnalyzeInput): Promise<AnalyzerResult> {
  const description = String(input?.description ?? "").trim();
  if (input?.website) return { ok: false, error: "invalid" };
  if (description.length < DESCRIPTION_MIN || description.length > DESCRIPTION_MAX) {
    return { ok: false, error: "invalid" };
  }
  const locale = input.locale === "en" ? "en" : "pl";
  const services = cleanServices(input.services);
  const ip = await clientIp();

  if (!(await verifyTurnstile(String(input.turnstileToken ?? ""), ip))) {
    return { ok: false, error: "captcha" };
  }

  const limits = await checkAnalyzerLimits(ip).catch(() => "unconfigured" as const);
  if (limits === "limited") return { ok: false, error: "limited" };
  if (limits === "unconfigured" && process.env.NODE_ENV === "production") {
    console.error("[analyzer] rate limit store not configured - refusing");
    return { ok: false, error: "unavailable" };
  }

  try {
    const completion = await groqClient().chat.completions.create(
      analyzerRequest(description, services, locale),
    );

    const choice = completion.choices[0];
    const usage = completion.usage;
    console.info(
      `[analyzer] ${completion.model} finish=${choice?.finish_reason} in=${usage?.prompt_tokens} out=${usage?.completion_tokens}`,
    );

    if (choice?.finish_reason !== "stop" || !choice.message.content) {
      return { ok: false, error: "unavailable" };
    }
    const analysis = readAnalysis(choice.message.content, services.length);
    if (analysis === "offTopic") return { ok: false, error: "offTopic" };
    if (!analysis) return { ok: false, error: "unavailable" };
    return { ok: true, analysis };
  } catch (error) {
    console.error("[analyzer] model call failed", error instanceof Error ? error.message : error);
    return { ok: false, error: "unavailable" };
  }
}
