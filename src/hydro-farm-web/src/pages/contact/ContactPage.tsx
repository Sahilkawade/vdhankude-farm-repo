import { PagePlaceholder } from '../../components/layout/PagePlaceholder';
import { pageMeta } from '../../utils/seo';

const description =
  'Plan a farm visit, ask about training or setup, or send us a general question.';

export function meta() {
  return pageMeta({ title: 'Contact & Visit Us', description, path: '/contact' });
}

export default function ContactPage() {
  return (
    <PagePlaceholder
      eyebrow="Contact"
      title="Visit the farm or talk to us"
      intro={description}
      buildPhase="The enquiry form is built in Phase 4 and connected to the API in Phase 6."
    />
  );
}
