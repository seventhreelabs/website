import type { PublicSiteConfigQuery } from "@/lib/graphql/generated/graphql";

/** Workspace branding as the delivery API returns it (Settings -> Branding in cmssy). */
export type SiteBranding = NonNullable<
  NonNullable<PublicSiteConfigQuery["public"]["siteConfig"]>["branding"]
>;

/** Key under which the page hands branding to blocks through `context.app`. */
export const BRANDING_CONTEXT_KEY = "branding";

export function readBranding(
  app: Record<string, unknown> | undefined,
): SiteBranding | null {
  return (app?.[BRANDING_CONTEXT_KEY] as SiteBranding | null | undefined) ?? null;
}
