import logoCompactInverse from './assets/logo-compact-inverse.svg';
import logoCompact from './assets/logo-compact.svg';
import logoFullInverse from './assets/logo-full-inverse.svg';
import logoFull from './assets/logo-full.svg';
import logoMarkInverse from './assets/logo-mark-inverse.svg';
import logoMark from './assets/logo-mark.svg';

export type LogoVariant = 'full' | 'compact' | 'mark';
export type LogoTone = 'default' | 'inverse';

interface LogoAsset {
  /** width / height of the artwork */
  aspectRatio: number;
  src: Record<LogoTone, string>;
}

/** Everything brand-specific in one place. Replace values and asset files to rebrand. */
export const brand = {
  name: 'V Dhankude Farm',
  tagline: 'Smart Farming - Fresh Future',
  description:
    'Learn hydroponic farming, visit a working farm, get practical training and plan your own hydroponic setup.',
  themeColor: '#00381B',
  favicon: logoMark,
  logos: {
    full: { aspectRatio: 199.6 / 39, src: { default: logoFull, inverse: logoFullInverse } },
    compact: {
      aspectRatio: 199.6 / 39,
      src: { default: logoCompact, inverse: logoCompactInverse },
    },
    mark: { aspectRatio: 1, src: { default: logoMark, inverse: logoMarkInverse } },
  } satisfies Record<LogoVariant, LogoAsset>,
} as const;
