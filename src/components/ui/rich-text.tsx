type RichTextProps = {
  /** HTML from a cmssy `fields.richText` field. Authored by workspace editors, so it is trusted. */
  html: string | undefined;
  className?: string;
};

/** Renders editor HTML with the site's prose styles (`.stl-prose` in globals.css). */
export function RichText({ html, className = "" }: RichTextProps) {
  if (!html) return null;
  return (
    <div
      className={`stl-prose ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
