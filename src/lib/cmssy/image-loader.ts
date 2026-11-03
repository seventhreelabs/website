import type { ImageLoaderProps } from "next/image";

/**
 * next/image loader for cmssy assets. Rewrites an assets.cmssy.io URL to the
 * CDN's resizing endpoint so the browser gets a variant sized for the slot
 * (1x and 2x) instead of the multi-megabyte original. Other hosts pass through.
 *
 * Runs in the browser, so it has no SDK imports; the width ladder mirrors
 * MEDIA_TRANSFORM_WIDTHS in @cmssy/types.
 */

const CDN_HOST = "assets.cmssy.io";
const WIDTHS = [96, 200, 400, 800, 1200, 1600, 2400];
const MAX_SIDE = 2400;

const snapWidth = (width: number) =>
  WIDTHS.find((allowed) => width <= allowed) ?? MAX_SIDE;

export default function cmssyImageLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }
  if (url.host !== CDN_HOST) return src;

  // Already transformed (crop, focal point...): keep those options, rescale.
  const match = url.pathname.match(/^\/cdn-cgi\/image\/([^/]+)\/(.+)$/);
  const options = new Map<string, string>(
    match
      ? match[1].split(",").map((pair) => {
          const [key, value = ""] = pair.split("=");
          return [key, value];
        })
      : [],
  );
  const source = match ? match[2] : url.pathname.replace(/^\//, "");

  const target = snapWidth(width);
  const prevWidth = Number(options.get("width"));
  const prevHeight = Number(options.get("height"));
  if (prevWidth > 0 && prevHeight > 0) {
    options.set("height", String(Math.round((prevHeight * target) / prevWidth)));
  }
  options.set("width", String(target));
  options.set("format", "auto");
  if (!options.has("fit")) options.set("fit", "scale-down");
  options.set("quality", String(quality ?? 85));

  const list = [...options].map(([key, value]) => `${key}=${value}`).join(",");
  return `${url.origin}/cdn-cgi/image/${list}/${source}`;
}
