'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { MobileNav } from './MobileNav';

const navLinks = [
  { href: '/learn', label: 'Learn' },
  { href: '/report', label: 'Report' },
  { href: '/mchango', label: 'Mchango' },
  { href: '/map', label: 'Map' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/reports', label: 'Reports' },
  { href: '/transparency', label: 'Transparency' },
  { href: '/calculator', label: 'Calculator' },
];

function getLocalizedHref(href: string, pathname: string | null): string {
  const locale = pathname?.split('/')[1] || 'en';
  return `/${locale}${href}`;
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--bg-secondary)]/95 backdrop-blur-sm border-b border-[var(--border-color)]"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            href={pathname ? `/${pathname.split('/')[1] || 'en'}` : '/en'}
            className="font-display font-black text-xl lg:text-2xl text-[var(--accent-1)] hover:text-[var(--accent-2)] transition-colors"
          >
            Campaign Finance Watch
          </Link>

          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={getLocalizedHref(link.href, pathname)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                  pathname?.includes(link.href)
                    ? 'bg-[var(--accent-1)]/10 text-[var(--accent-1)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="lg:hidden p-2.5 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center bg-[var(--bg-primary)] border border-[var(--border-color)]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <MobileNav
        links={navLinks.map((l) => ({ ...l, href: getLocalizedHref(l.href, pathname) }))}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
