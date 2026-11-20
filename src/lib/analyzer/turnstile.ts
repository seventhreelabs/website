// Cloudflare's published test secret: always passes. Used only outside production builds
// (the matching test site key is in the analyzer block's client form).
const TEST_SECRET = "1x0000000000000000000000000000000AA";

const secret =
  process.env.TURNSTILE_SECRET_KEY ||
  (process.env.NODE_ENV === "production" ? undefined : TEST_SECRET);

/** Server-side check of a Turnstile token. No secret = fail closed. */
export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!secret || !token) return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      cache: "no-store",
    });
    const data: { success?: boolean } = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}
