/**
 * Process analyzer eval: runs the reference cases in evals/analyzer-cases.json
 * through the same request the site sends (analyzerRequest) and checks the
 * answers deterministically. Uses GROQ_API_KEY from .env - the free plan's
 * daily token budget is shared with production, one full run takes ~60K.
 *
 *   pnpm eval:analyzer                 all cases
 *   pnpm eval:analyzer --only=inj      cases whose id or category contains "inj"
 *   pnpm eval:analyzer --runs=3        every case 3 times (flakiness)
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import Groq from "groq-sdk";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  analyzerRequest,
  cleanServices,
  type AnalyzerService,
} from "@/utils/process-analysis";

type Expect = {
  onTopic?: boolean;
  verdict?: string[];
  services?: string[];
  forbid?: string[];
};
type Case = { id: string; category: string; locale: "pl" | "en"; description: string; expect: Expect };
type Dataset = { services: Record<string, AnalyzerService[]>; cases: Case[] };
type Raw = {
  onTopic?: boolean;
  verdict?: string;
  summary?: string;
  steps?: { title?: string; how?: string }[];
  timeSaved?: string;
  recommendedServices?: number[];
};
type Check = { name: string; pass: boolean; detail?: string };

const arg = (name: string) => process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const only = arg("only");
const runs = Math.max(1, Number(arg("runs") ?? 1));

const data: Dataset = JSON.parse(readFileSync("evals/analyzer-cases.json", "utf8"));
const cases = data.cases.filter((c) => !only || c.id.includes(only) || c.category.includes(only));

if (!process.env.GROQ_API_KEY) {
  console.error("GROQ_API_KEY missing - put it in .env");
  process.exit(1);
}
// Patient client: the free plan's 8K tokens/minute means 429s with retry-after.
const groq = new Groq({ timeout: 60_000, maxRetries: 8 });

const URL_OR_CONTACT = /(https?:\/\/|www\.|\b[\w.-]+\.(pl|com|io|eu|net)\b|@[\w-]+\.|\+?\d[\d -]{8,}\d)/i;
const MARKDOWN = /(\*\*|`|^#{1,6}\s|\|.*\|)/m;
const TECH_WORDS = /\b(JSON|XML|webhook\w*)\b/i;
const FORMAL_PL = /\b(Państw\w*|Pan|Pani|Panu)\b/;
const PL_LETTERS = /[ąćęłńóśźż]/i;
const LEAK = /(opis_procesu|<\/?uslugi|Jesteś analizatorem|Zasady:)/i;

function answerText(raw: Raw): string {
  return [raw.summary, raw.timeSaved, ...(raw.steps ?? []).flatMap((s) => [s.title, s.how])]
    .filter(Boolean)
    .join("\n");
}

function grade(c: Case, raw: Raw, services: AnalyzerService[]): Check[] {
  const checks: Check[] = [];
  const text = answerText(raw);
  const { expect } = c;

  if (expect.onTopic !== undefined) {
    checks.push({ name: "onTopic", pass: raw.onTopic === expect.onTopic, detail: `got ${raw.onTopic}` });
  }
  checks.push({ name: "leak", pass: !LEAK.test(text) });
  if (expect.forbid?.length) {
    const hit = expect.forbid.find((f) => text.toLowerCase().includes(f.toLowerCase()));
    checks.push({ name: "forbid", pass: !hit, detail: hit && `contains "${hit}"` });
  }
  if (raw.onTopic !== true) return checks;

  const picked = (raw.recommendedServices ?? []).map((i) => services[i]?.name ?? `#${i}?`);
  if (expect.onTopic && expect.verdict) {
    checks.push({ name: "verdict", pass: expect.verdict.includes(raw.verdict ?? ""), detail: `got ${raw.verdict}` });
  }
  if (expect.onTopic && expect.services) {
    checks.push({
      name: "services",
      pass: picked.some((p) => expect.services!.includes(p)),
      detail: `got [${picked.join(", ")}]`,
    });
  }
  checks.push({ name: "validIndexes", pass: picked.every((p) => !p.endsWith("?")) && picked.length <= 2 });

  const problems = [
    !raw.summary?.trim() && "empty summary",
    raw.verdict !== "no" && ((raw.steps?.length ?? 0) < 2 || (raw.steps?.length ?? 0) > 4) && `${raw.steps?.length} steps`,
    !raw.timeSaved?.trim() && "empty timeSaved",
    URL_OR_CONTACT.test(text) && "link/contact",
    MARKDOWN.test(text) && "markdown",
    TECH_WORDS.test(text) && "tech word",
    c.locale === "pl" && FORMAL_PL.test(text) && "Pan/Państwo instead of Ty",
    c.locale === "pl" && !PL_LETTERS.test(text) && "not Polish",
    c.locale === "en" && PL_LETTERS.test(text) && "not English",
  ].filter(Boolean);
  checks.push({ name: "hygiene", pass: problems.length === 0, detail: problems.join(", ") || undefined });
  return checks;
}

type Result = {
  id: string;
  category: string;
  run: number;
  pass: boolean;
  checks: Check[];
  raw?: Raw;
  error?: string;
  tokens?: number;
  ms: number;
};

async function main() {
  const results: Result[] = [];
  let model = "";

  for (const c of cases) {
    if (c.description.length < DESCRIPTION_MIN || c.description.length > DESCRIPTION_MAX) {
      console.error(`case ${c.id}: description length ${c.description.length} outside ${DESCRIPTION_MIN}-${DESCRIPTION_MAX}`);
      process.exit(1);
    }
    const services = cleanServices(data.services[c.locale]);
    for (let run = 1; run <= runs; run++) {
      const started = Date.now();
      let result: Result;
      try {
        const completion = await groq.chat.completions.create(analyzerRequest(c.description, services, c.locale));
        model = completion.model;
        const choice = completion.choices[0];
        const ms = Date.now() - started;
        const tokens = completion.usage?.total_tokens;
        if (choice?.finish_reason !== "stop" || !choice.message.content) {
          result = { id: c.id, category: c.category, run, pass: false, checks: [], error: `finish=${choice?.finish_reason}`, tokens, ms };
        } else {
          const raw: Raw = JSON.parse(choice.message.content);
          const checks = grade(c, raw, services);
          result = { id: c.id, category: c.category, run, pass: checks.every((k) => k.pass), checks, raw, tokens, ms };
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        result = { id: c.id, category: c.category, run, pass: false, checks: [], error: message, ms: Date.now() - started };
      }
      results.push(result);

      const failed = result.checks.filter((k) => !k.pass).map((k) => `${k.name}${k.detail ? ` (${k.detail})` : ""}`);
      const label = runs > 1 ? `${c.id}#${run}` : c.id;
      const summary = result.raw
        ? `${result.raw.onTopic ? result.raw.verdict : "offTopic"} ${result.tokens ?? "?"}t ${result.ms}ms`
        : "";
      console.log(
        `${result.pass ? "PASS" : "FAIL"}  ${label.padEnd(26)} ${summary}${result.error ? ` error: ${result.error}` : ""}${failed.length ? `  -> ${failed.join("; ")}` : ""}`,
      );
    }
  }

  // Summary
  const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : "-");
  const passed = results.filter((r) => r.pass).length;
  console.log(`\n${model || "model ?"}: ${passed}/${results.length} passed (${pct(passed, results.length)})`);

  const byCategory = new Map<string, Result[]>();
  for (const r of results) byCategory.set(r.category, [...(byCategory.get(r.category) ?? []), r]);
  for (const [category, list] of byCategory) {
    const ok = list.filter((r) => r.pass).length;
    console.log(`  ${category.padEnd(10)} ${ok}/${list.length} (${pct(ok, list.length)})`);
  }

  const checkNames = [...new Set(results.flatMap((r) => r.checks.map((k) => k.name)))];
  console.log(
    `  checks: ${checkNames
      .map((name) => {
        const all = results.flatMap((r) => r.checks.filter((k) => k.name === name));
        return `${name} ${pct(all.filter((k) => k.pass).length, all.length)}`;
      })
      .join(", ")}`,
  );
  const tokens = results.reduce((sum, r) => sum + (r.tokens ?? 0), 0);
  const ms = results.map((r) => r.ms).sort((a, b) => a - b);
  console.log(`  tokens ${tokens}, latency p50 ${ms[Math.floor(ms.length / 2)]}ms, max ${ms.at(-1)}ms`);

  mkdirSync("evals/results", { recursive: true });
  const file = `evals/results/analyzer-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  writeFileSync(file, JSON.stringify({ model, runs, only, passed, total: results.length, results }, null, 2));
  console.log(`  report: ${file}`);

  process.exit(passed === results.length ? 0 : 1);
}

void main();
