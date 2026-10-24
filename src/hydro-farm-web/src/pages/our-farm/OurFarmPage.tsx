import { PagePlaceholder } from '../../components/layout/PagePlaceholder';
import { pageMeta } from '../../utils/seo';

const description =
  'See our working hydroponic farm: the growing systems, the process and the technology behind it.';

export function meta() {
  return pageMeta({ title: 'Our Farm', description, path: '/our-farm' });
}

export default function OurFarmPage() {
  return (
    <PagePlaceholder
      eyebrow="Our farm"
      title="See hydroponics in action"
      intro={description}
      buildPhase="This page is built in Phase 3."
    />
  );
}
