import { cache as memo } from "react";
import { cmssyCachedFetch, type CmssyDataCacheOptions } from "@cmssy/next/server";
import type { ResolvedMedia } from "@cmssy/core";
import { cmssy } from "@/cmssy.config";
import { PublicModelRecordsDocument } from "@/lib/graphql/generated/graphql";
import { cmssyClient } from "@/lib/cmssy/client";
import { siteLocales } from "@/lib/cmssy/locales";
import type { Post } from "@/lib/posts";
import { siteConfig } from "@/services/site";

const MODEL = "post";

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function parsePost(record: { id: string; data: unknown; updatedAt: string }): Post | null {
  const data = (record.data ?? {}) as Record<string, unknown>;
  const slug = text(data.slug);
  if (!slug) return null;
  return {
    id: record.id,
    slug,
    title: text(data.title),
    excerpt: text(data.excerpt),
    body: text(data.body),
    cover: data.cover && typeof data.cover === "object" ? (data.cover as ResolvedMedia) : null,
    publishedAt: text(data.publishedAt).slice(0, 10),
    updatedOn: text(data.updatedOn).slice(0, 10) || null,
    author: text(data.author),
    tags: Array.isArray(data.tags) ? data.tags.filter((t): t is string => typeof t === "string") : [],
    inEnglish: data.inEnglish === true,
    seoTitle: text(data.seoTitle),
    seoDescription: text(data.seoDescription),
    updatedAt: record.updatedAt,
  };
}

type Query = { filter?: Record<string, unknown>; limit?: number; offset?: number; preview?: boolean };

async function fetchPosts(
  locale: string,
  cache: CmssyDataCacheOptions | undefined,
  query: Query,
): Promise<Post[]> {
  const [site, locales] = await Promise.all([siteConfig(cache), siteLocales()]);
  if (!site) return [];
  // a post appears in a non-default language only once its translation is marked ready
  const filter = {
    ...(locale !== locales.defaultLocale ? { inEnglish: true } : {}),
    ...query.filter,
  };
  const data = await cmssyClient.query(
    PublicModelRecordsDocument,
    {
      workspaceId: site.workspaceId,
      modelSlug: MODEL,
      filter,
      sort: "publishedAt_desc",
      locale,
      limit: query.limit ?? 100,
      offset: query.offset ?? 0,
      // draft mode: unpublished records too, never from the content cache
      ...(query.preview ? { previewSecret: cmssy.draftSecret } : {}),
    },
    { public: true, retry: {}, ...(cache && !query.preview ? { fetch: cmssyCachedFetch(cache) } : {}) },
  );
  return data.public.model.records.items.map(parsePost).filter((p): p is Post => p !== null);
}

function listPosts(locale: string, cache?: CmssyDataCacheOptions, limit?: number, preview?: boolean): Promise<Post[]> {
  return fetchPosts(locale, cache, { limit, preview });
}

async function findPost(slug: string, locale: string, cache?: CmssyDataCacheOptions, preview?: boolean): Promise<Post | null> {
  const [found] = await fetchPosts(locale, cache, { filter: { slug }, limit: 1, preview });
  return found ?? null;
}

/** Published posts visible in `locale`, newest first; with `preview` drafts too. */
export const posts = memo(listPosts);

/** One post by slug, or null when missing, unpublished (unless `preview`) or not yet in `locale`. */
export const post = memo(findPost);

/** Every published post with its languages - sitemap, feeds, static params. */
export async function postIndex(
  cache?: CmssyDataCacheOptions,
): Promise<{ slug: string; updatedAt: string; locales: string[] }[]> {
  const locales = await siteLocales();
  const all = await fetchPosts(locales.defaultLocale, cache, { limit: 500 });
  return all.map((p) => ({
    slug: p.slug,
    updatedAt: p.updatedAt,
    locales: locales.locales.filter((code) => code === locales.defaultLocale || p.inEnglish),
  }));
}
