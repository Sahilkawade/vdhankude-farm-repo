/**
 * Site-wide navigation and contact details.
 * Contact values are placeholders until the real details are confirmed for publication.
 */
export interface NavItem {
  label: string;
  to: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export const mainNav: readonly NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Hydroponics', to: '/hydroponics' },
  { label: 'Our Farm', to: '/our-farm' },
  { label: 'Training', to: '/training' },
  { label: 'Farm Setup', to: '/farm-setup' },
  { label: 'Contact', to: '/contact' },
];

export const primaryCta: NavItem = { label: 'Visit Our Farm', to: '/contact?interest=farm-visit' };

export const contact = {
  phone: '[PHONE]',
  email: '[EMAIL]',
  whatsapp: '[PHONE]',
  location: '[LOCATION]',
} as const;

/** [SOCIAL_LINKS]: add entries when the accounts are confirmed. */
export const socialLinks: readonly SocialLink[] = [];
