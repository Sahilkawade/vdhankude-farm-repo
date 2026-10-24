import type { MetaDescriptor } from 'react-router';
import { brand } from '../brand/brand.config';
import { env } from '../config/env';

interface PageMetaInput {
  /** Page title without the site name; omit on the home page. */
  title?: string;
  description: string;
  path: string;
}

/** Builds title, description, Open Graph and canonical tags for a route. */
export function pageMeta({ title, description, path }: PageMetaInput): MetaDescriptor[] {
  const fullTitle = title
    ? `${title} | ${brand.name}`
    : `${brand.name} | Hydroponic Farming, Training & Setup`;
  const url = env.siteUrl ? `${env.siteUrl}${path}` : undefined;

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: brand.name },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    ...(url
      ? [
          { property: 'og:url', content: url },
          { tagName: 'link', rel: 'canonical', href: url },
        ]
      : []),
  ];
}
