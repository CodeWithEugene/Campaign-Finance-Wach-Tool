'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { MobileNav } from './MobileNav';
import { getMessage } from '@/lib/i18n';

const navLinkKeys = [
  { href: '/learn', key: 'nav.learn' },
  { href: '/intelligence', key: 'nav.intelligence' },
  { href: '/report', key: 'nav.report' },
  { href: '/mchango', key: 'nav.mchango' },
  { href: '/map', key: 'nav.map' },
  { href: '/dashboard', key: 'nav.dashboard' },
  { href: '/reports', key: 'nav.reports' },
  { href: '/transparency', key: 'nav.transparency' },
  { href: '/calculator', key: 'nav.calculator' },
];

function getLocalizedHref(href: string, pathname: string | null): string {
  const locale = pathname?.split('/')[1] || 'en';
  return `/${locale}${href}`;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const locale = pathname?.split('/')[1] || 'en';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-[var(--bg-secondary)]/95 backdrop-blur-sm border-b border-[var(--border-color)]"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xs mx-4"
            role="search"
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getMessage(locale, 'search.placeholder')}
              className="w-full px-3 py-2 rounded-l-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm"
              aria-label="Search reports"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-r-lg bg-[var(--accent-1)] text-white"
              aria-label="Submit search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinkKeys.map((link) => (
              <Link
                key={link.href}
                href={getLocalizedHref(link.href, pathname)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                  pathname?.includes(link.href)
                    ? 'bg-[var(--accent-1)]/10 text-[var(--accent-1)]'
                    : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                }`}
              >
                {getMessage(locale, link.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {status === 'authenticated' ? (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                className="hidden sm:block px-3 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded-lg"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="hidden sm:block px-3 py-2 text-sm font-medium text-[var(--accent-1)] hover:bg-[var(--bg-primary)] rounded-lg"
                >
                  Sign in
                </Link>
                <Link
                  href={`/${locale}/signup`}
                  className="hidden sm:block px-3 py-2 text-sm font-medium bg-[var(--accent-1)] text-white rounded-lg hover:opacity-90"
                >
                  Sign up
                </Link>
              </>
            )}
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
        links={navLinkKeys.map((l) => ({
          href: getLocalizedHref(l.href, pathname),
          label: getMessage(locale, l.key),
        }))}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  );
}
