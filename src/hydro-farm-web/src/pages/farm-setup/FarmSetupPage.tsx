import { PagePlaceholder } from '../../components/layout/PagePlaceholder';
import { pageMeta } from '../../utils/seo';

const description =
  'Whether you want to start at home, on a terrace, or at a larger scale, we can help you plan and build your hydroponic setup.';

export function meta() {
  return pageMeta({ title: 'Farm Setup', description, path: '/farm-setup' });
}

export default function FarmSetupPage() {
  return (
    <PagePlaceholder
      eyebrow="Farm setup"
      title="Ready to Start Your Own Hydroponic Farm?"
      intro={description}
      buildPhase="This page is built in Phase 4."
    />
  );
}
