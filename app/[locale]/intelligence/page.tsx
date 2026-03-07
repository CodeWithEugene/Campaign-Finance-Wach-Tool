'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Search, Users, User, Clock, TrendingUp, ExternalLink, Database } from 'lucide-react';
import { getAllIntelligenceEntities } from '@/lib/intelligenceData';

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

const PREFILLED_POLITICIANS = getAllIntelligenceEntities().filter((e) => e.type === 'politician');
const PREFILLED_PARTIES_WITH_PHOTOS = getAllIntelligenceEntities().filter((e) => e.type === 'party');

function EntityAvatar({
  entity,
  type,
}: {
  entity: { id: string; name: string; imageUrl: string };
  type: 'party' | 'politician';
}) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div className="w-16 h-16 rounded-full overflow-hidden bg-[var(--bg-primary)] border-2 border-[var(--border-color)] group-hover:border-[var(--accent-1)] flex items-center justify-center">
      {!imgFailed ? (
        <Image
          src={entity.imageUrl}
          alt=""
          width={64}
          height={64}
          className="w-full h-full object-cover"
          unoptimized
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="text-[var(--text-secondary)]">
          {type === 'party' ? <Users className="w-8 h-8" /> : <User className="w-8 h-8" />}
        </span>
      )}
    </div>
  );
}

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

      {/* Prefilled parties with photos from the web */}
      {PREFILLED_PARTIES_WITH_PHOTOS.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 font-display font-bold text-lg mb-3">
            <Users className="w-4 h-4 text-[var(--accent-1)]" />
            Browse parties (with photos)
          </h2>
          <div className="flex flex-wrap gap-4">
            {PREFILLED_PARTIES_WITH_PHOTOS.slice(0, 6).map((entity) => (
              <button
                key={entity.id}
                type="button"
                onClick={(e) => {
                  setQuery(entity.name);
                  setSearchType('party');
                  handleSearch(e, entity.name);
                }}
                className="flex flex-col items-center gap-2 w-24 text-center group"
              >
                <EntityAvatar entity={entity} type="party" />
                <span className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-1)] truncate w-full">
                  {entity.name}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Prefilled politicians with photos from the web */}
      {PREFILLED_POLITICIANS.length > 0 && (
        <section className="mb-10">
          <h2 className="flex items-center gap-2 font-display font-bold text-lg mb-3">
            <User className="w-4 h-4 text-[var(--accent-1)]" />
            Browse politicians (with photos)
          </h2>
          <div className="flex flex-wrap gap-4">
            {PREFILLED_POLITICIANS.map((entity) => (
              <button
                key={entity.id}
                type="button"
                onClick={(e) => {
                  setQuery(entity.name);
                  setSearchType('politician');
                  handleSearch(e, entity.name);
                }}
                className="flex flex-col items-center gap-2 w-24 text-center group"
              >
                <EntityAvatar entity={entity} type="politician" />
                <span className="text-xs font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-1)] truncate w-full">
                  {entity.name}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <section id="data-sources" className="mb-10 p-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <h2 className="flex items-center gap-2 font-display font-bold text-xl mb-4">
          <Database className="w-5 h-5 text-[var(--accent-1)]" />
          Official data sources
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          All intelligence is tied to public records and official portals. Use these links to verify and explore actual data.
        </p>
        <ul className="space-y-3 text-sm">
          <li>
            <a
              href="https://orpp.or.ke/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--accent-1)] hover:underline"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              Office of the Registrar of Political Parties (ORPP) — PPF administration, registered parties, fund distribution
            </a>
          </li>
          <li>
            <a
              href="https://orpp.or.ke/document/political-parties-fund-ppf-distribution-2023/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--accent-1)] hover:underline"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              ORPP — Political Parties Fund (PPF) distribution by year
            </a>
          </li>
          <li>
            <a
              href="https://www.oagkenya.go.ke/political-parties-audit-reports/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--accent-1)] hover:underline"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              Office of the Auditor-General (OAG) — Political parties audit reports
            </a>
          </li>
          <li>
            <a
              href="https://www.oagkenya.go.ke/public-funded-political-parties/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--accent-1)] hover:underline"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              OAG — Public funded political parties
            </a>
          </li>
          <li>
            <a
              href="https://www.iebc.or.ke/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--accent-1)] hover:underline"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              IEBC — Independent Electoral and Boundaries Commission (election results, party list)
            </a>
          </li>
          <li>
            <a
              href="https://www.iebc.or.ke/index.php/election-results"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--accent-1)] hover:underline"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              IEBC — Election results portal
            </a>
          </li>
          <li>
            <a
              href="https://tikenya.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--accent-1)] hover:underline"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              Transparency International Kenya (TI-Kenya) — Campaign finance and governance reports
            </a>
          </li>
          <li>
            <a
              href="https://campaignwatch.tikenya.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[var(--accent-1)] hover:underline"
            >
              <ExternalLink className="w-4 h-4 flex-shrink-0" />
              Campaign Watch (TI-Kenya) — Report misuse of public resources during campaigns
            </a>
          </li>
        </ul>
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
