/** Public, build-time configuration. Never put secrets in VITE_ variables. */
export const env = {
  /** Public site origin without trailing slash, e.g. https://example.com. Empty in development. */
  siteUrl: (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, ''),
  /** API origin. Empty means same origin (/api), proxied by Vite in development. */
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, ''),
} as const;
