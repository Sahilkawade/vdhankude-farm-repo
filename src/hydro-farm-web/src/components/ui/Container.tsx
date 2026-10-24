import type { ComponentPropsWithoutRef } from 'react';
import { cx } from '../../utils/cx';
import styles from './Container.module.css';

/** Centres content at the max content width with responsive side gutters. */
export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx(styles.container, className)} {...props} />;
}
