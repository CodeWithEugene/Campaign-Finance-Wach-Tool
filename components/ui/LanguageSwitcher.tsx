'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'sw', label: 'SW' },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';
  const pathWithoutLocale = pathname?.replace(/^\/[a-z]{2}/, '') || '/';

  return (
    <div className="flex gap-1">
      {locales.map((locale) => (
        <Link
          key={locale.code}
          href={`/${locale.code}${pathWithoutLocale}`}
          className={`px-3 py-2 rounded-lg text-sm font-medium min-h-[44px] flex items-center ${
            currentLocale === locale.code
              ? 'bg-[var(--accent-1)] text-white'
              : 'bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
          aria-label={`Switch to ${locale.code === 'en' ? 'English' : 'Kiswahili'}`}
        >
          {locale.label}
        </Link>
      ))}
    </div>
  );
}
