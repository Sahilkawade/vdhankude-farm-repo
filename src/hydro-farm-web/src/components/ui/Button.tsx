import type { ButtonHTMLAttributes } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cx } from '../../utils/cx';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'inverse';
export type ButtonSize = 'md' | 'sm';

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

function buttonClass({ variant = 'primary', size = 'md' }: StyleProps, className?: string) {
  return cx(styles.button, styles[variant], size === 'sm' && styles.small, className);
}

/** A navigation link styled as a button. */
export function ButtonLink({ variant, size, className, ...props }: LinkProps & StyleProps) {
  return <Link className={buttonClass({ variant, size }, className)} {...props} />;
}

/** An action button (forms, toggles). */
export function Button({
  variant,
  size,
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & StyleProps) {
  return <button type={type} className={buttonClass({ variant, size }, className)} {...props} />;
}
