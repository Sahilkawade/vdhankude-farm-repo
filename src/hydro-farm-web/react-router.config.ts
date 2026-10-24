import type { Config } from '@react-router/dev/config';

export default {
  appDirectory: 'src',
  // No Node server in production: every static route is pre-rendered to its own HTML file
  // at build time (good for SEO and link previews) and then hydrates into the SPA.
  ssr: false,
  prerender: true,
} satisfies Config;
