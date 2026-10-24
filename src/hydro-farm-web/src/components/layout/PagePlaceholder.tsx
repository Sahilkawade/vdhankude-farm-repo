import type { ReactNode } from 'react';
import { Container } from '../ui/Container';
import styles from './PagePlaceholder.module.css';

interface PagePlaceholderProps {
  eyebrow: string;
  title: string;
  intro: string;
  /** Development note shown under the intro until the page is built. */
  buildPhase: string;
  actions?: ReactNode;
}

/**
 * Temporary page body used while the real page sections are built (phases 2–4).
 * Delete once every page has its own sections.
 */
export function PagePlaceholder({
  eyebrow,
  title,
  intro,
  buildPhase,
  actions,
}: PagePlaceholderProps) {
  return (
    <section className={styles.section}>
      <Container className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h1>{title}</h1>
        <p className={styles.intro}>{intro}</p>
        {actions && <div className={styles.actions}>{actions}</div>}
        <p className={styles.note}>{buildPhase}</p>
      </Container>
    </section>
  );
}
