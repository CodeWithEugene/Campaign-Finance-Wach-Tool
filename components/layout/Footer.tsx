'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AccessibilityToggles } from '@/components/ui/AccessibilityToggles';
import { getMessage } from '@/lib/i18n';

const footerSections: { sectionKey: string; links: { href: string; labelKey: string }[] }[] = [
  {
    sectionKey: 'footer.sectionLearn',
    links: [
      { href: '/learn', labelKey: 'footer.educationHub' },
      { href: '/learn/ppf', labelKey: 'footer.ppf' },
      { href: '/learn/glossary', labelKey: 'footer.glossary' },
    ],
  },
  {
    sectionKey: 'footer.sectionAct',
    links: [
      { href: '/report', labelKey: 'footer.reportMisuse' },
      { href: '/mchango', labelKey: 'footer.mchango' },
      { href: '/map', labelKey: 'footer.viewMap' },
    ],
  },
  {
    sectionKey: 'footer.sectionData',
    links: [
      { href: '/dashboard', labelKey: 'footer.dashboard' },
      { href: '/reports', labelKey: 'footer.reports' },
      { href: '/transparency', labelKey: 'footer.transparencyIndex' },
      { href: '/trends', labelKey: 'footer.trends' },
    ],
  },
  {
    sectionKey: 'footer.sectionResources',
    links: [
      { href: '/press', labelKey: 'footer.pressKit' },
      { href: '/api-docs', labelKey: 'footer.apiDocs' },
      { href: '/data-sources', labelKey: 'footer.dataSources' },
      { href: '/alerts', labelKey: 'footer.newsletter' },
    ],
  },
  {
    sectionKey: 'footer.sectionLegal',
    links: [
      { href: '/terms', labelKey: 'footer.terms' },
      { href: '/privacy', labelKey: 'footer.privacy' },
      { href: '/about', labelKey: 'footer.about' },
      { href: '/contact', labelKey: 'footer.contact' },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  return (
    <footer
      className="bg-[var(--bg-secondary)] border-t border-[var(--border-color)] mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          {footerSections.map(({ sectionKey, links }) => (
            <div key={sectionKey}>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[var(--text-secondary)] mb-4">
                {getMessage(locale, sectionKey)}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-1)] transition-colors text-sm"
                    >
                      {getMessage(locale, link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
          <div className="mb-4 flex flex-wrap justify-center gap-6">
            <AccessibilityToggles />
          </div>
          <p className="text-center text-sm text-[var(--text-secondary)]">
            {getMessage(locale, 'footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
