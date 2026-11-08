/**
 * A bare `#section` in the shared header or footer means a section of the home
 * page, so it has to work from every page, not only from the home page itself.
 */
export function homeAnchor(href: string): string {
  return href.trim().startsWith("#") ? `/${href.trim()}` : href;
}
