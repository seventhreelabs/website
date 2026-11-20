import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Vercel's Upstash integration names them KV_*; a direct Upstash setup UPSTASH_REDIS_*.
const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const dailyTotal = Number(process.env.ANALYZER_DAILY_LIMIT) || 120;

const redis = url && token ? new Redis({ url, token }) : null;

const limiter = (limit: ReturnType<typeof Ratelimit.slidingWindow>, prefix: string) =>
  redis ? new Ratelimit({ redis, limiter: limit, prefix }) : null;

const perIpHour = limiter(Ratelimit.slidingWindow(5, "1 h"), "analyzer:ip:h");
const perIpDay = limiter(Ratelimit.slidingWindow(15, "1 d"), "analyzer:ip:d");
const everyone = limiter(Ratelimit.fixedWindow(dailyTotal, "1 d"), "analyzer:all:d");

/**
 * Per-IP limits first, so one visitor cannot drain the shared daily budget,
 * then the global cap that keeps us inside the Groq quota (free plan: ~200K tokens/day, ~1.3K per analysis measured). `unconfigured` = no Redis.
 */
export async function checkAnalyzerLimits(ip: string): Promise<"ok" | "limited" | "unconfigured"> {
  if (!perIpHour || !perIpDay || !everyone) return "unconfigured";
  // Only a hash of the IP reaches Redis (privacy policy says so).
  const key = createHash("sha256").update(ip).digest("hex").slice(0, 32);
  const [hour, day] = await Promise.all([perIpHour.limit(key), perIpDay.limit(key)]);
  if (!hour.success || !day.success) return "limited";
  const total = await everyone.limit("all");
  return total.success ? "ok" : "limited";
}
