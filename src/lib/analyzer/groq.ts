import Groq from "groq-sdk";

let client: Groq | null = null;

/** Lazy singleton; reads GROQ_API_KEY. Short timeout - a visitor is waiting. */
export function groqClient(): Groq {
  client ??= new Groq({ timeout: 45_000, maxRetries: 1 });
  return client;
}
