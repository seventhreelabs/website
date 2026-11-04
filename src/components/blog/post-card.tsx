import Image from "next/image";
import { mediaAlt, mediaUrl } from "@cmssy/react";
import type { Post } from "@/lib/posts";
import { tagLabel } from "@/utils/post-tags";
import { PostMeta } from "./post-meta";

type PostCardProps = {
  post: Post;
  href: string;
  locale: string;
  /** Heading level for the title - h2 in a list, h3 under a section heading. */
  as?: "h2" | "h3";
};

/** One post in a list: cover, date, title, excerpt, tags. The whole card links. */
export function PostCard({ post, href, locale, as: Heading = "h2" }: PostCardProps) {
  const cover = mediaUrl(post.cover);

  return (
    <article className="group grid gap-5 border-t border-line py-8 md:grid-cols-[2fr_3fr] md:gap-10">
      {cover ? (
        <a href={href} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-xl bg-soft">
          <Image
            src={cover}
            alt={mediaAlt(post.cover) ?? ""}
            width={640}
            height={360}
            sizes="(min-width: 768px) 30vw, 100vw"
            className="aspect-video h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </a>
      ) : (
        <div className="hidden md:block" />
      )}
      <div className="min-w-0">
        <PostMeta publishedAt={post.publishedAt} locale={locale} />
        <Heading className="m-0 mt-3 text-header3-clamp font-medium tracking-[-0.02em] text-balance">
          <a href={href} className="hover:underline">
            {post.title}
          </a>
        </Heading>
        {post.excerpt ? <p className="mt-3 max-w-prose text-rim">{post.excerpt}</p> : null}
        {post.tags.length ? (
          <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-line px-3 py-1 font-mono text-label uppercase text-rim">
                {tagLabel(tag, locale)}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
