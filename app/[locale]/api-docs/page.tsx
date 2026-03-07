'use client';

import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';

export default function ApiDocsPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const base = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
        API documentation
      </h1>
      <p className="text-[var(--text-secondary)] mb-8">
        Public endpoints for reports, export, and embeddable widgets.
      </p>

      <Card className="mb-8">
        <h2 className="font-display font-bold text-xl mb-4">Export reports (CSV/JSON)</h2>
        <p className="text-[var(--text-secondary)] mb-2">
          <code className="bg-[var(--bg-primary)] px-2 py-1 rounded">GET /api/export/reports?format=csv</code>
        </p>
        <p className="text-sm text-[var(--text-secondary)] mb-2">
          Query params: <code>format</code> (csv | json), optional <code>status</code>, <code>category</code>, <code>county</code>.
        </p>
        <p className="text-sm">
          Example: <a href={`${base}/api/export/reports?format=csv`} className="text-[var(--accent-1)] hover:underline">
            {base}/api/export/reports?format=csv
          </a>
        </p>
      </Card>

      <Card className="mb-8">
        <h2 className="font-display font-bold text-xl mb-4">Press kit</h2>
        <p className="text-[var(--text-secondary)] mb-2">
          <code className="bg-[var(--bg-primary)] px-2 py-1 rounded">GET /api/press-kit</code>
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          Returns a multipart response with summary and sample CSV.
        </p>
      </Card>

      <Card className="mb-8">
        <h2 className="font-display font-bold text-xl mb-4">Embeddable widgets</h2>
        <p className="text-[var(--text-secondary)] mb-2">Map widget:</p>
        <pre className="p-4 bg-[var(--bg-primary)] rounded-lg text-sm overflow-x-auto mb-4">
          {`<iframe src="${base}/${locale}/embed/map" width="600" height="400" title="Campaign Finance Map"></iframe>`}
        </pre>
        <p className="text-[var(--text-secondary)] mb-2">Chart widget:</p>
        <pre className="p-4 bg-[var(--bg-primary)] rounded-lg text-sm overflow-x-auto">
          {`<iframe src="${base}/${locale}/embed/chart" width="600" height="400" title="Campaign Finance Chart"></iframe>`}
        </pre>
      </Card>

      <Card>
        <h2 className="font-display font-bold text-xl mb-4">USSD</h2>
        <p className="text-[var(--text-secondary)]">
          Report via USSD: dial the shortcode and follow the menu (language → category → description → location → confirm).
          Reports are stored in the database and appear in the dashboard after submission.
        </p>
      </Card>
    </div>
  );
}
