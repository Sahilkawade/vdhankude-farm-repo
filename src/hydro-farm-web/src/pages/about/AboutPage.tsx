import { PagePlaceholder } from '../../components/layout/PagePlaceholder';
import { pageMeta } from '../../utils/seo';

const description =
  'Who we are, why we started, and how we help people learn and adopt hydroponic farming.';

export function meta() {
  return pageMeta({ title: 'About Us', description, path: '/about' });
}

export default function AboutPage() {
  return (
    <PagePlaceholder
      eyebrow="About us"
      title="Helping people learn and start hydroponic farming"
      intro={description}
      buildPhase="This page is built in Phase 3."
    />
  );
}
