import { PagePlaceholder } from '../../components/layout/PagePlaceholder';
import { ButtonLink } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { primaryCta } from '../../config/site';
import { pageMeta } from '../../utils/seo';

export function meta() {
  return pageMeta({
    description:
      'Discover how hydroponic farming can transform the way you grow, from your home and terrace to farms and commercial spaces.',
    path: '/',
  });
}

export default function HomePage() {
  return (
    <PagePlaceholder
      eyebrow="Modern Hydroponic Farm"
      title="Grow More. Grow Smarter. Grow Anywhere."
      intro="Discover how hydroponic farming can transform the way you grow, from your home and terrace to farms and commercial spaces."
      buildPhase="Home page sections are built in Phase 2."
      actions={
        <>
          <ButtonLink to="/hydroponics">
            Explore Hydroponics <Icon name="arrow-right" size={18} />
          </ButtonLink>
          <ButtonLink to={primaryCta.to} variant="secondary">
            {primaryCta.label}
          </ButtonLink>
        </>
      }
    />
  );
}
