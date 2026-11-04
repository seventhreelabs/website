import { localizeHref } from "@cmssy/core";
import { fields, type BlockProps, type InferBlockContent } from "@cmssy/react";
import { PostCard } from "@/components/blog/post-card";
import { Section } from "@/components/ui/section";
import { anchorField } from "@/lib/cmssy/fields";
import { POSTS_CONTEXT_KEY, postSlug, readPosts } from "@/lib/posts";

export type BlogListContent = InferBlockContent<typeof blogListProps>;

export const blogListProps = {
  anchor: anchorField("blog"),
  heading: fields.text({ label: "Nagłówek", required: true }),
  intro: fields.textarea({ label: "Wstęp", helperText: "Jedno, dwa zdania o tym, o czym piszemy." }),
  emptyText: fields.text({ label: "Tekst, gdy nie ma wpisów" }),
};

/** All published posts, newest first. The list comes from the `post` model, not from the editor. */
export default function BlogList({ content, context }: BlockProps<typeof blogListProps>) {
  const posts = readPosts(context?.app, POSTS_CONTEXT_KEY);
  const locale = context?.locale;
  const href = (slug: string) => (locale ? localizeHref(postSlug(slug), locale) : postSlug(slug));

  return (
    <Section anchor={content.anchor} innerClassName="max-w-5xl">
      <h1 className="m-0 text-header1-clamp font-medium tracking-[-0.03em] text-balance">{content.heading}</h1>
      {content.intro ? <p className="mt-6 max-w-prose text-large-clamp text-rim">{content.intro}</p> : null}
      <div className="mt-12 border-b border-line">
        {posts.length ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} href={href(post.slug)} locale={locale?.current ?? "pl"} />
          ))
        ) : (
          <p className="py-8 text-rim">{content.emptyText}</p>
        )}
      </div>
    </Section>
  );
}
