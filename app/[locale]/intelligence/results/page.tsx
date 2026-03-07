'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  ExternalLink,
  Megaphone,
  Banknote,
  Newspaper,
  LayoutGrid,
  User,
  Users,
} from 'lucide-react';
import type { IntelligenceActivity, ActivityCategory } from '@/app/api/intelligence/route';

const CAMPAIGN_PERIODS = [
  { value: '2017', label: '2017 campaign' },
  { value: '2022', label: '2022 campaign' },
  { value: '2027', label: '2027 campaign' },
] as const;

const TABS: { id: 'all' | ActivityCategory; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Activities', icon: LayoutGrid },
  { id: 'rally', label: 'Rallies', icon: Megaphone },
  { id: 'financial', label: 'Financial', icon: Banknote },
  { id: 'news', label: 'News', icon: Newspaper },
];

function formatDate(s: string) {
  try {
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleDateString('en-KE', { day: 'numeric', month: 'numeric', year: 'numeric' });
  } catch {
    return s;
  }
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.split('/')[1] || 'en';
  const q = searchParams.get('q')?.trim() ?? '';
  const type = (searchParams.get('type') === 'politician' ? 'politician' : 'party') as 'party' | 'politician';
  const periodParam = searchParams.get('period');
  const initialPeriod = ['2017', '2022', '2027'].includes(periodParam ?? '') ? periodParam! : '2022';

  const [period, setPeriod] = useState(initialPeriod);
  const [activeTab, setActiveTab] = useState<'all' | ActivityCategory>('all');
  const [activities, setActivities] = useState<IntelligenceActivity[]>([]);
  const [entity, setEntity] = useState<{
    id: string;
    name: string;
    type: string;
    imageUrl: string;
    bio?: string;
  } | null>(null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q) {
      setLoading(false);
      setActivities([]);
      setEntity(null);
      return;
    }
    setLoading(true);
    setError(null);
    setImageError(false);
    fetch('/api/intelligence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q, type, campaignPeriod: period }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
        return res.json();
      })
      .then((data) => {
        setActivities(data.activities ?? []);
        setEntity(data.entity ?? null);
      })
      .catch((err) => {
        setError(err.message ?? 'Failed to load intelligence');
        setActivities([]);
        setEntity(null);
      })
      .finally(() => setLoading(false));
  }, [q, type, period]);

  const updatePeriod = (newPeriod: string) => {
    setPeriod(newPeriod);
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', newPeriod);
    router.replace(`/${locale}/intelligence/results?${params.toString()}`, { scroll: false });
  };

  const filtered =
    activeTab === 'all'
      ? activities
      : activities.filter((a) => a.category === activeTab);

  const counts: Record<'all' | ActivityCategory, number> = {
    all: activities.length,
    rally: activities.filter((a) => a.category === 'rally').length,
    financial: activities.filter((a) => a.category === 'financial').length,
    news: activities.filter((a) => a.category === 'news').length,
    other: activities.filter((a) => a.category === 'other').length,
  };

  if (!q) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-[var(--text-secondary)]">
          No search query. <Link href={`/${locale}/intelligence`} className="text-[var(--accent-1)] hover:underline">Go to Intelligence</Link> and search for a party or politician.
        </p>
      </div>
    );
  }

  const displayName = entity?.name ?? q;
  const showPhoto = entity?.imageUrl && !imageError;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Link href={`/${locale}/intelligence`} className="text-[var(--accent-1)] hover:underline text-sm">
          ← Intelligence
        </Link>
        <Link href={`/${locale}/intelligence#data-sources`} className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-1)] hover:underline">
          Official data sources →
        </Link>
      </div>

      {/* Hero: photo + name + bio (prefilled data from the internet) */}
      <header className="mb-8 p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-[var(--bg-primary)] flex items-center justify-center">
          {showPhoto ? (
            <Image
              src={entity!.imageUrl}
              alt=""
              width={128}
              height={128}
              className="w-full h-full object-cover"
              unoptimized
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-[var(--text-secondary)]">
              {type === 'party' ? <Users className="w-12 h-12" /> : <User className="w-12 h-12" />}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-[var(--text-secondary)] mb-1">
            {type === 'party' ? 'Party' : 'Politician'}
          </p>
          <h1 className="font-display font-black text-2xl sm:text-3xl mb-2">
            {displayName}
          </h1>
          {entity?.bio && (
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              {entity.bio}
            </p>
          )}
        </div>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
          Campaign period:
          <select
            value={period}
            onChange={(e) => updatePeriod(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)]"
            aria-label="Choose campaign period"
          >
            {CAMPAIGN_PERIODS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav className="border-b border-[var(--border-color)] mb-6" aria-label="Activity tabs">
        <ul className="flex flex-wrap gap-1">
          {TABS.map((tab) => (
            <li key={tab.id}>
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors min-h-[44px] ${
                  activeTab === tab.id
                    ? 'border-[var(--accent-1)] text-[var(--accent-1)]'
                    : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label} ({tab.id === 'all' ? counts.all : counts[tab.id as keyof typeof counts]})
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {loading && (
        <p className="text-[var(--text-secondary)] py-8">Loading intelligence...</p>
      )}
      {error && (
        <p className="text-red-600 dark:text-red-400 py-4">{error}</p>
      )}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-[var(--text-secondary)] py-8">
          No activities in this category for the selected period. Try another campaign period or search term.
        </p>
      )}
      {!loading && filtered.length > 0 && (
        <ul className="space-y-6">
          {filtered.map((item, i) => (
            <li
              key={`${item.title}-${i}`}
              className="p-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  {item.title}
                </h2>
                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-1 rounded text-[var(--text-secondary)] hover:text-[var(--accent-1)]"
                    aria-label="Open source"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-[var(--text-secondary)] mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" aria-hidden />
                  {formatDate(item.date)}
                </span>
                {item.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" aria-hidden />
                    {item.location}
                  </span>
                )}
                {item.amount && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {item.amount}
                  </span>
                )}
              </div>
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-xs bg-[var(--bg-primary)] border border-[var(--border-color)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function IntelligenceResultsPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
