/**
 * Dicebear HTTP API — React Native `Image` cannot decode remote SVG.
 * Same avatar is available as PNG by swapping the format segment in the path.
 * @see https://www.dicebear.com/how-to-use/http-api/
 */
export const DICEBEAR_API = {
  HOST: 'api.dicebear.com',
  STYLE_FORMAT_SVG: '/svg',
  STYLE_FORMAT_PNG: '/png',
} as const;

/**
 * Returns a URI suitable for `Image` / raster loaders (PNG instead of SVG).
 * Only transforms URLs on `DICEBEAR_API.HOST` (`api.dicebear.com`).
 */
export function dicebearUriToRasterImageUri(uri: string): string {
  const trimmed = uri.trim();
  if (!trimmed) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname !== DICEBEAR_API.HOST) {
      return trimmed;
    }
    if (/\/svg$/i.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/svg$/i, DICEBEAR_API.STYLE_FORMAT_PNG);
      return url.href;
    }
    if (/\.svg$/i.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\.svg$/i, DICEBEAR_API.STYLE_FORMAT_PNG);
      return url.href;
    }
  } catch {
    /* not a valid URL */
  }
  return trimmed;
}
