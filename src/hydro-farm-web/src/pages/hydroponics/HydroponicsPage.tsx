import { PagePlaceholder } from '../../components/layout/PagePlaceholder';
import { pageMeta } from '../../utils/seo';

const description =
  'What hydroponics is, how it works, the main growing systems, and whether it is right for you, explained in plain language.';

export function meta() {
  return pageMeta({ title: 'What is Hydroponics?', description, path: '/hydroponics' });
}

export default function HydroponicsPage() {
  return (
    <PagePlaceholder
      eyebrow="Hydroponics"
      title="What is Hydroponic Farming?"
      intro={description}
      buildPhase="This page is built in Phase 3."
    />
  );
}
