'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { KENYAN_LOCALES } from '@/lib/locales';
import { getMessage } from '@/lib/i18n';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const currentLocale = pathname?.split('/')[1] || 'en';
  const pathWithoutLocale = pathname?.replace(/^\/[a-z]{2,3}/, '') || '/';
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentName = KENYAN_LOCALES.find((l) => l.code === currentLocale)?.name ?? currentLocale;
  const label = getMessage(currentLocale, 'lang.button');

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium min-h-[44px] bg-[var(--bg-primary)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${label}. Current: ${currentName}`}
      >
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 py-1 min-w-[220px] max-h-[70vh] overflow-y-auto bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg z-[100]"
        >
          {KENYAN_LOCALES.map((loc) => (
            <li key={loc.code} role="option" aria-selected={currentLocale === loc.code}>
              <Link
                href={`/${loc.code}${pathWithoutLocale}`}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-sm hover:bg-[var(--bg-primary)] ${
                  currentLocale === loc.code ? 'bg-[var(--accent-1)]/15 text-[var(--accent-1)] font-medium' : ''
                }`}
              >
                {loc.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
