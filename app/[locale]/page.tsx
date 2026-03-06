'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FileWarning, MapPin, GraduationCap, BarChart3 } from 'lucide-react';
import { getMessage } from '@/lib/i18n';

const quickActions = [
  { href: '/report', label: 'Report Misuse', description: 'Submit evidence of campaign finance violations', icon: FileWarning },
  { href: '/mchango', label: 'Mchango', description: 'Contribute to parties or candidates transparently', icon: BarChart3 },
  { href: '/learn', label: 'Learn', description: 'Understand campaign funding and legal limits', icon: GraduationCap },
  { href: '/map', label: 'View Map', description: 'Explore reports on an interactive map', icon: MapPin },
];

export default function HomePage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh-light dark:bg-mesh-dark pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] mb-6 fade-in-up stagger-1">
            {getMessage(locale, 'home.title')}
          </h1>
          <p className="text-lg lg:text-xl text-[var(--text-secondary)] mb-10 font-light fade-in-up stagger-2">
            {getMessage(locale, 'home.subtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 fade-in-up stagger-3">
            <Link
              href={`/${locale}/report`}
              className="px-8 py-4 bg-[var(--accent-1)] text-white font-bold rounded-lg hover:opacity-90 transition-opacity min-h-[44px] flex items-center"
            >
              {getMessage(locale, 'home.report')}
            </Link>
            <Link
              href={`/${locale}/learn`}
              className="px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] font-bold rounded-lg hover:border-[var(--accent-1)] transition-colors min-h-[44px] flex items-center"
            >
              {getMessage(locale, 'home.learn')}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-display font-black text-2xl lg:text-3xl mb-8 text-center fade-in-up stagger-1">
          Take Action
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <div key={action.href} className={`fade-in-up stagger-${Math.min(i + 2, 5)}`}>
              <Link
                href={`/${locale}${action.href}`}
                className="block p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--accent-1)] transition-colors h-full"
              >
                <action.icon className="w-10 h-10 text-[var(--accent-1)] mb-4" />
                <h3 className="font-display font-bold text-lg mb-2">{action.label}</h3>
                <p className="text-sm text-[var(--text-secondary)] font-light">{action.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
