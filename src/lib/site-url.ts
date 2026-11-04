/** Canonical site origin: explicit env first, then Vercel's production domain, then local dev. */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

/** Path segments from the catch-all route -> cmssy slug ("/" or "/a/b"). */
export function slugFromPath(path: string[] | undefined): string {
  return `/${(path ?? []).join("/")}`;
}

/** The markdown twin of a localized page path: `/index.md`, `/en/index.md`, `/en/blog/x.md`. */
export function markdownPath(slug: string, localizedPagePath: string): string {
  if (slug === "/") return `${localizedPagePath.replace(/\/$/, "")}/index.md`;
  return `${localizedPagePath}.md`;
}
