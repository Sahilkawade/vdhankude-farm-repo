import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { brand } from '../../brand/brand.config';
import { Logo } from '../../brand/Logo';
import { mainNav, primaryCta } from '../../config/site';
import { ButtonLink } from '../ui/Button';
import { Container } from '../ui/Container';
import { Icon } from '../ui/Icon';
import styles from './SiteHeader.module.css';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the mobile menu and returns focus to the toggle.
  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <Container className={styles.bar}>
        <Link to="/" className={styles.brand} aria-label={`${brand.name} home`} onClick={closeMenu}>
          <Logo variant="compact" height={46} className={styles.logo} />
        </Link>

        <nav className={styles.desktopNav} aria-label="Main">
          {mainNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={styles.navLink}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <ButtonLink to={primaryCta.to} size="sm" className={styles.cta}>
          {primaryCta.label}
        </ButtonLink>

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>
      </Container>

      <nav id="mobile-nav" className={styles.mobileNav} aria-label="Mobile" hidden={!menuOpen}>
        <Container className={styles.mobileNavInner}>
          {mainNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={styles.mobileLink}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
          <ButtonLink to={primaryCta.to} className={styles.mobileCta} onClick={closeMenu}>
            {primaryCta.label}
          </ButtonLink>
        </Container>
      </nav>
    </header>
  );
}
