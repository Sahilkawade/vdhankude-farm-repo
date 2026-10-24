import { brand, type LogoTone, type LogoVariant } from './brand.config';

interface LogoProps {
  /** full: with tagline (footer, large) · compact: no tagline (header) · mark: the "D" only */
  variant?: LogoVariant;
  /** inverse: white version for dark backgrounds */
  tone?: LogoTone;
  /** Rendered height in CSS pixels; width follows the artwork's aspect ratio. */
  height?: number;
  className?: string;
}

/** The only component that renders the logo. */
export function Logo({ variant = 'compact', tone = 'default', height = 44, className }: LogoProps) {
  const logo = brand.logos[variant];

  return (
    <img
      src={logo.src[tone]}
      alt={brand.name}
      width={Math.round(height * logo.aspectRatio)}
      height={height}
      className={className}
      decoding="async"
    />
  );
}
