'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Users, User, Clock, TrendingUp } from 'lucide-react';

const POPULAR_PARTIES = [
  'ODM',
  'UDA',
  'Jubilee',
  'Azimio',
  'Wiper',
  'ANC',
  'FORD-K',
  'KNC',
  'PNU',
  'UPIA',
];

const RECENT_SEARCHES = [
  'William Ruto',
  'UDA',
  'ODM',
  'Azimio',
  'Rigathi Gachagua',
];

export default function IntelligencePage() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.split('/')[1] || 'en';
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'party' | 'politician'>('party');

  const handleSearch = (e: React.FormEvent, searchValue?: string) => {
    e.preventDefault();
    const q = (searchValue ?? query).trim();
    if (!q) return;
    const params = new URLSearchParams({ q, type: searchType });
    router.push(`/${locale}/intelligence/results?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <p className="text-[var(--text-secondary)] text-center mb-8">
        Search for any political party or politician to view comprehensive intelligence from public sources.
      </p>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative flex items-center rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-primary)] focus-within:border-[var(--accent-1)] transition-colors">
          <Search className="w-5 h-5 text-[var(--text-secondary)] ml-4 flex-shrink-0" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a party (e.g. ODM) or politician (e.g. Raila Odinga)..."
            className="flex-1 px-4 py-4 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none rounded-r-xl"
            aria-label="Search party or politician"
          />
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setSearchType('party')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors min-h-[44px] ${
              searchType === 'party'
                ? 'bg-[var(--accent-1)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
            }`}
          >
            <Users className="w-4 h-4" />
            Parties
          </button>
          <button
            type="button"
            onClick={() => setSearchType('politician')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors min-h-[44px] ${
              searchType === 'politician'
                ? 'bg-[var(--accent-1)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
            }`}
          >
            <User className="w-4 h-4" />
            Politicians
          </button>
        </div>
      </form>

      <section className="mb-10">
        <h2 className="flex items-center gap-2 font-display font-bold text-lg mb-3">
          <Clock className="w-4 h-4 text-[var(--accent-1)]" />
          Recent Searches
        </h2>
        <div className="flex flex-wrap gap-2">
          {RECENT_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={(e) => {
                setQuery(term);
                setSearchType(term === 'ODM' || term === 'UDA' || term === 'Azimio' ? 'party' : 'politician');
                handleSearch(e, term);
              }}
              className="px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-1)] hover:bg-[var(--accent-1)]/5 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="flex items-center gap-2 font-display font-bold text-lg mb-3">
          <TrendingUp className="w-4 h-4 text-[var(--accent-1)]" />
          Popular Parties
        </h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR_PARTIES.map((party) => (
            <button
              key={party}
              type="button"
              onClick={(e) => {
                setQuery(party);
                setSearchType('party');
                handleSearch(e, party);
              }}
              className="px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--accent-1)] hover:bg-[var(--accent-1)]/5 transition-colors"
            >
              {party}
            </button>
          ))}
        </div>
      </section>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border-2 border-[var(--accent-1)]/50 bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-6 h-6 text-[var(--accent-1)]" />
            <h3 className="font-display font-bold text-lg">Search a Party</h3>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            View all party members, PPF funding history, campaign activities, transparency scores, and aggregated intelligence from public sources.
          </p>
        </div>
        <div className="p-6 rounded-xl border-2 border-emerald-500/50 bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-6 h-6 text-emerald-600" />
            <h3 className="font-display font-bold text-lg">Search a Politician</h3>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Track rallies, campaign spending, news mentions, financial signals, and public activities scraped from news outlets and official sources.
          </p>
        </div>
      </div>
    </div>
  );
}
