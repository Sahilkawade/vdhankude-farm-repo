import '@fontsource-variable/manrope/wght.css';
import '@fontsource-variable/montserrat/wght.css';
import './brand/tokens.css';
import './styles/theme.css';
import './styles/base.css';

import type { ReactNode } from 'react';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import type { Route } from './+types/root';
import { brand } from './brand/brand.config';
import { PageLayout } from './components/layout/PageLayout';
import { PagePlaceholder } from './components/layout/PagePlaceholder';

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: brand.favicon, type: 'image/svg+xml' },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={brand.themeColor} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  if (import.meta.env.DEV) {
    console.error(error);
  }

  return (
    <PageLayout>
      <PagePlaceholder
        eyebrow={isNotFound ? 'Page not found' : 'Something went wrong'}
        title={isNotFound ? 'We couldn’t find that page' : 'Sorry, this page didn’t load'}
        intro="Please use the menu to find what you were looking for, or try again in a moment."
        buildPhase="If the problem continues, contact us and let us know which page you were on."
      />
    </PageLayout>
  );
}
