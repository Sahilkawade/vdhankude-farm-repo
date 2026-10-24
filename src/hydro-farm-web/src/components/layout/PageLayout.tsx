import type { ReactNode } from 'react';
import styles from './PageLayout.module.css';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className={styles.skipLink}>
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className={styles.main}>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
