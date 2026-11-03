import { cmssy } from "@/cmssy.config";
import { cmssyClient } from "@/lib/cmssy/client";
import { PublishedPagesDocument } from "@/lib/graphql/generated/graphql";

/** Published page paths for generateStaticParams. */
export async function publishedPaths(): Promise<{ path: string[] }[]> {
  const data = await cmssyClient.query(
    PublishedPagesDocument,
    { workspaceSlug: cmssy.workspaceSlug },
    { public: true, retry: {} },
  );

  return data.public.page.list
    .filter((page) => page.publishedAt)
    .map((page) => ({ path: page.slug.split("/").filter(Boolean) }));
}
