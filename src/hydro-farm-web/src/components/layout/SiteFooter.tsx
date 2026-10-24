import { Link } from 'react-router';
import { brand } from '../../brand/brand.config';
import { Logo } from '../../brand/Logo';
import { contact, mainNav, primaryCta, socialLinks } from '../../config/site';
import { Container } from '../ui/Container';
import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const year = new Date().getFullYear();
  const exploreLinks = mainNav.filter((item) => item.to !== '/' && item.to !== '/contact');

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.about}>
            <Logo variant="full" tone="inverse" height={56} className={styles.logo} />
            <p className={styles.description}>{brand.description}</p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className={styles.heading}>
              Explore
            </h2>
            <ul className={styles.list}>
              {exploreLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={styles.heading}>Contact</h2>
            <ul className={styles.list}>
              <li>{contact.phone}</li>
              <li>{contact.email}</li>
              <li>WhatsApp: {contact.whatsapp}</li>
              {socialLinks.length > 0 ? (
                socialLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} rel="noopener noreferrer" target="_blank">
                      {link.label}
                    </a>
                  </li>
                ))
              ) : (
                <li>[SOCIAL_LINKS]</li>
              )}
            </ul>
          </div>

          <div>
            <h2 className={styles.heading}>Visit</h2>
            <ul className={styles.list}>
              <li>{contact.location}</li>
              <li>
                <Link to={primaryCta.to}>Schedule a farm visit</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {year} {brand.name}. All rights reserved.
          </p>
          <p>{brand.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
