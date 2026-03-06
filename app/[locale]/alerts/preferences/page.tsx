'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';

export default function AlertsPreferencesPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="fade-in-up">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Digest Preferences
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Choose how often you receive updates
        </p>

        <Card>
          <h2 className="font-display font-bold text-lg mb-4">Frequency</h2>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <input type="radio" name="freq" id="daily" defaultChecked />
              <label htmlFor="daily">Daily digest</label>
            </li>
            <li className="flex items-center gap-2">
              <input type="radio" name="freq" id="weekly" />
              <label htmlFor="weekly">Weekly digest</label>
            </li>
            <li className="flex items-center gap-2">
              <input type="radio" name="freq" id="verified" />
              <label htmlFor="verified">Only when new verified report</label>
            </li>
          </ul>
        </Card>

        <Link
          href={`/${locale}/alerts`}
          className="inline-block mt-8 text-[var(--accent-1)] hover:underline"
        >
          ← Back to Alerts
        </Link>
      </div>
    </div>
  );
}
