import type { LocalizedBlock } from "@/services/markdown";
import type { Post } from "@/lib/posts";
import { tagLabel } from "@/utils/post-tags";

type Thing = Record<string, unknown>;

export type StructuredDataInput = {
  origin: string;
  url: string;
  locale: string;
  siteName: string;
  logoUrl?: string | null;
  title: string;
  description: string;
  slug: string;
  blocks: LocalizedBlock[];
};

/**
 * schema.org graph for a page: Organization and WebSite once, the WebPage,
 * breadcrumbs below the home page, and what the blocks carry - services as a
 * Service list, FAQ as FAQPage, team members as Person.
 */
export function structuredData(input: StructuredDataInput): { "@context": string; "@graph": Thing[] } {
  const orgId = `${input.origin}/#organization`;
  const siteId = `${input.origin}/#website`;
  const graph: Thing[] = [];
  const contact = input.blocks.find((b) => b.type === "contact")?.content as { email?: string } | undefined;
  const services = input.blocks.find((b) => b.type === "services")?.content as
    | { items?: { title?: string; text?: string }[] }
    | undefined;
  const faq = input.blocks.find((b) => b.type === "faq")?.content as
    | { items?: { question?: string; answer?: string }[] }
    | undefined;
  const team = input.blocks.find((b) => b.type === "team")?.content as
    | { members?: { name?: string; role?: string; bio?: string; profileUrl?: string }[] }
    | undefined;

  graph.push({
    "@type": "Organization",
    "@id": orgId,
    name: input.siteName,
    url: input.origin,
    ...(input.logoUrl ? { logo: input.logoUrl } : {}),
    ...(contact?.email ? { email: contact.email } : {}),
    ...(services?.items?.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: input.siteName,
            itemListElement: services.items
              .filter((s) => s.title)
              .map((s) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: s.title, description: s.text, provider: { "@id": orgId } },
              })),
          },
        }
      : {}),
  });
  graph.push({ "@type": "WebSite", "@id": siteId, name: input.siteName, url: input.origin, inLanguage: input.locale, publisher: { "@id": orgId } });
  graph.push({
    "@type": "WebPage",
    "@id": input.url,
    url: input.url,
    name: input.title,
    description: input.description,
    inLanguage: input.locale,
    isPartOf: { "@id": siteId },
    about: { "@id": orgId },
  });
  if (input.slug !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: input.siteName, item: input.origin },
        { "@type": "ListItem", position: 2, name: input.title, item: input.url },
      ],
    });
  }
  if (faq?.items?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: faq.items
        .filter((i) => i.question && i.answer)
        .map((i) => ({ "@type": "Question", name: i.question, acceptedAnswer: { "@type": "Answer", text: i.answer } })),
    });
  }
  for (const m of team?.members ?? []) {
    if (!m.name || /^(Imię Nazwisko|First Last)$/.test(m.name)) continue;
    graph.push({
      "@type": "Person",
      name: m.name,
      ...(m.role ? { jobTitle: m.role } : {}),
      ...(m.bio ? { description: m.bio } : {}),
      ...(m.profileUrl ? { sameAs: [m.profileUrl] } : {}),
      worksFor: { "@id": orgId },
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

/** Serialise for a `<script type="application/ld+json">` without closing it early. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export type PostStructuredDataInput = {
  origin: string;
  url: string;
  blogUrl: string;
  blogName: string;
  locale: string;
  siteName: string;
  logoUrl?: string | null;
  post: Post;
  coverUrl?: string | null;
};

/** BlogPosting with its publisher and breadcrumbs. */
export function postStructuredData(input: PostStructuredDataInput): { "@context": string; "@graph": Thing[] } {
  const orgId = `${input.origin}/#organization`;
  const p = input.post;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": orgId, name: input.siteName, url: input.origin, ...(input.logoUrl ? { logo: input.logoUrl } : {}) },
      {
        "@type": "BlogPosting",
        "@id": input.url,
        mainEntityOfPage: input.url,
        url: input.url,
        headline: p.title,
        description: p.seoDescription || p.excerpt,
        inLanguage: input.locale,
        datePublished: p.publishedAt,
        dateModified: p.updatedOn ?? p.publishedAt,
        ...(p.author ? { author: { "@type": "Person", name: p.author, worksFor: { "@id": orgId } } } : {}),
        publisher: { "@id": orgId },
        ...(input.coverUrl ? { image: input.coverUrl } : {}),
        ...(p.tags.length ? { keywords: p.tags.map((t) => tagLabel(t, input.locale)).join(", ") } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: input.siteName, item: input.origin },
          { "@type": "ListItem", position: 2, name: input.blogName, item: input.blogUrl },
          { "@type": "ListItem", position: 3, name: p.title, item: input.url },
        ],
      },
    ],
  };
}
