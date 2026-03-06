'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const footerLinks = {
  Learn: [
    { href: '/learn', label: 'Education Hub' },
    { href: '/learn/ppf', label: 'Political Parties Fund' },
    { href: '/learn/glossary', label: 'Glossary' },
  ],
  Act: [
    { href: '/report', label: 'Report Misuse' },
    { href: '/mchango', label: 'Mchango' },
    { href: '/map', label: 'View Map' },
  ],
  Data: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/reports', label: 'Reports' },
    { href: '/transparency', label: 'Transparency Index' },
    { href: '/trends', label: 'Historical Trends' },
  ],
  Resources: [
    { href: '/press', label: 'Press Kit' },
    { href: '/data-sources', label: 'Data Sources' },
    { href: '/alerts', label: 'Newsletter' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
};

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
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-display font-bold text-sm uppercase tracking-wider text-[var(--text-secondary)] mb-4">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-1)] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--border-color)] text-center text-sm text-[var(--text-secondary)]">
          <p>
            Campaign Finance Watch Tool — TI-Kenya Hackathon. Built for a more
            transparent Kenya.
          </p>
        </div>
      </div>
    </footer>
  );
}
