import { PagePlaceholder } from '../../components/layout/PagePlaceholder';
import { pageMeta } from '../../utils/seo';

const description =
  'Practical hydroponic training based on running a real farm, from the basics to day-to-day operation.';

export function meta() {
  return pageMeta({ title: 'Training', description, path: '/training' });
}

export default function TrainingPage() {
  return (
    <PagePlaceholder
      eyebrow="Training"
      title="Learn From Experience"
      intro={description}
      buildPhase="This page is built in Phase 4."
    />
  );
}
