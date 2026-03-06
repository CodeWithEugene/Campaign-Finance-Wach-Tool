'use client';

import Link from 'next/link';
import { BookOpen, FileText, Scale, Calendar, HelpCircle, Download } from 'lucide-react';

const learnPages = [
  { href: '/learn/funding-overview', label: 'Campaign Funding Overview', icon: BookOpen },
  { href: '/learn/ppf', label: 'The 0.3% Political Parties Fund', icon: FileText },
  { href: '/learn/formula', label: 'PPF Distribution Formula', icon: Scale },
  { href: '/learn/spending-limits', label: 'Legal Spending Limits', icon: Scale },
  { href: '/learn/expenditure-period', label: 'Expenditure Period & Calendar', icon: Calendar },
  { href: '/learn/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/learn/glossary', label: 'Glossary', icon: BookOpen },
  { href: '/learn/download', label: 'Download Resources', icon: Download },
];

export default function LearnPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
        className="mb-12"
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-4">
          Information & Education
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
          Learn how political parties and candidates receive funding in Kenya,
          the legal limits governing campaign spending, and your rights as a
          citizen.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {learnPages.map((page, i) => (
          <div
            key={page.href}
           
           
           
          >
            <Link
              href={page.href}
              className="block p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--accent-1)] transition-colors h-full"
            >
              <page.icon className="w-10 h-10 text-[var(--accent-1)] mb-4" />
              <h2 className="font-display font-bold text-lg">{page.label}</h2>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
