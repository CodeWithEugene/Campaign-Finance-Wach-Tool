import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Download } from 'lucide-react';

export default function PressPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Press & Research Toolkit
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Resources for journalists and researchers
        </p>

        <Card className="mb-8">
          <h2 className="font-display font-bold text-xl mb-4">About Campaign Finance Watch</h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Campaign Finance Watch Tool is a digital platform for tracking
            political financing, visualizing campaign finance data, and
            monitoring misuse of public resources in Kenya. Built for the
            TI-Kenya Campaign Finance Watch Tool Hackathon.
          </p>
          <p className="text-[var(--text-secondary)]">
            Key stats: 1,247 total reports, 312 verified, 47 counties covered.
          </p>
        </Card>

        <Card className="mb-8">
          <h2 className="font-display font-bold text-xl mb-4">One-Click Export</h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Export CSV, PDF summary, and key charts. Apply date range and
            category filters.
          </p>
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-1)] text-white font-bold rounded-lg"
            aria-label="Download press kit"
          >
            <Download className="w-4 h-4" /> Download Press Kit
          </button>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-xl mb-4">Embeddable Widgets</h2>
          <p className="text-[var(--text-secondary)] mb-4">
            Embed the map or chart widgets on your site. Copy-paste the iframe
            code.
          </p>
          <pre className="p-4 bg-[var(--bg-primary)] rounded-lg text-sm overflow-x-auto">
            {`<iframe src="https://campaign-finance-wach-tool.vercel.app/embed/map" width="600" height="400"></iframe>`}
          </pre>
        </Card>
      </div>
    </div>
  );
}
