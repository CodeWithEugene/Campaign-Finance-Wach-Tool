'use client';

import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          About Campaign Finance Watch Tool
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Built for the TI-Kenya Campaign Finance Watch Tool Hackathon
        </p>

        <div className="space-y-6">
          <Card>
            <h2 className="font-display font-bold text-xl mb-4">Mission</h2>
            <p className="text-[var(--text-secondary)]">
              Campaign Finance Watch Tool empowers Kenyan citizens to track
              political financing, visualize campaign finance data, and monitor
              misuse of public resources. We promote transparency and
              accountability in political finance.
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">TI-Kenya</h2>
            <p className="text-[var(--text-secondary)]">
              Transparency International Kenya is a national civil society
              organization working towards a transparent and corruption-free
              society. With over 25 years of experience, TI-Kenya promotes
              integrity, transparency, and accountability.
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">Partners</h2>
            <p className="text-[var(--text-secondary)]">
              This project is part of the Kenya Institutional Strengthening
              Program (KISP), implemented with ELGIA, URAI Trust, CMD, and
              support from FCDO.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
