'use client';

import { Card } from '@/components/ui/Card';
import { Mail, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Contact
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Media inquiries and general contact
        </p>

        <Card>
          <h2 className="font-display font-bold text-xl mb-4">
            TI-Kenya / @iLabAfrica
          </h2>
          <ul className="space-y-3 text-[var(--text-secondary)]">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +254 703 034 616
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              ilabafrica@strathmore.edu
            </li>
            <li>
              Strathmore University Student Centre, Keri Road, Nairobi
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
