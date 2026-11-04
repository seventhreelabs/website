import { respondSiteMarkdown } from "./respond";

export const revalidate = 3600;

export function GET() {
  return respondSiteMarkdown();
}
