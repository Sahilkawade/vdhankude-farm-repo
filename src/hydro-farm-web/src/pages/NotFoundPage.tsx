import { PagePlaceholder } from '../components/layout/PagePlaceholder';
import { ButtonLink } from '../components/ui/Button';
import { brand } from '../brand/brand.config';

export function meta() {
  return [{ title: `Page not found | ${brand.name}` }, { name: 'robots', content: 'noindex' }];
}

export default function NotFoundPage() {
  return (
    <PagePlaceholder
      eyebrow="Page not found"
      title="We couldn’t find that page"
      intro="The page may have moved, or the link may be mistyped."
      buildPhase="Use the menu above, or go back to the home page."
      actions={<ButtonLink to="/">Go to the home page</ButtonLink>}
    />
  );
}
