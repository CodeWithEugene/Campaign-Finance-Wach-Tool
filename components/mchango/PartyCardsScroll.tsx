'use client';

import { useRef, useState, useEffect } from 'react';

export type PartyWithMeta = {
  slug: string;
  name: string;
  leader: string;
  symbol: string;
  goalKes: number; // goal in KES
  accent: string; // CSS color or var(--accent-1)
};

const PARTY_META: Record<string, Omit<PartyWithMeta, 'name'>> = {
  uda: {
    slug: 'uda',
    leader: 'William Ruto',
    symbol: 'Wheelbarrow',
    goalKes: 400_000_000,
    accent: '#facc15',
  },
  odm: {
    slug: 'odm',
    leader: 'Raila Odinga',
    symbol: 'Orange',
    goalKes: 600_000_000,
    accent: '#ea580c',
  },
  jubilee: {
    slug: 'jubilee',
    leader: 'Uhuru Kenyatta',
    symbol: 'Dove',
    goalKes: 7_000_000_000,
    accent: '#dc2626',
  },
  'wdm-k': {
    slug: 'wdm-k',
    leader: 'Kalonzo Musyoka',
    symbol: 'Umbrella',
    goalKes: 350_000_000,
    accent: '#2563eb',
  },
};

function formatKesM(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  return `${(n / 1e6).toFixed(1)}M`;
}

export function PartyCardsScroll({
  parties,
  totalsByParty,
  onDonate,
  locale = 'en',
}: {
  parties: { slug: string; name: string }[];
  totalsByParty: Record<string, { total: number; count: number }>;
  onDonate: (slug: string) => void;
  locale?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const rafRef = useRef<number>(0);

  // Continuous scroll left; duplicate content so there's always overflow. Reset when one full set scrolled for seamless loop.
  const cardWidthPx = 280 + 16; // card width + gap
  const singleSetWidth = cardWidthPx * parties.length;

  useEffect(() => {
    if (paused || !scrollRef.current || parties.length === 0) return;
    const el = scrollRef.current;
    const step = 1.4;
    let last = 0;
    const tick = (now: number) => {
      if (!last) last = now;
      const delta = Math.min(now - last, 50);
      last = now;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      el.scrollLeft += step * (delta / 16);
      // Seamless loop: when we've scrolled one set, jump back by one set width
      if (el.scrollLeft >= singleSetWidth - 1) {
        el.scrollLeft -= singleSetWidth;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, parties.length, singleSetWidth]);

  const cards: PartyWithMeta[] = parties.map((p) => {
    const meta = PARTY_META[p.slug] ?? {
      slug: p.slug,
      leader: '—',
      symbol: '—',
      goalKes: 100_000_000,
      accent: 'var(--accent-1)',
    };
    return { ...meta, name: p.name };
  });

  const totalRaised = (slug: string) => totalsByParty[slug]?.total ?? 0;

  return (
    <section
      className="relative mb-10 px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between mb-3 max-w-7xl mx-auto">
        <h2 className="font-display font-bold text-xl">Political Parties</h2>
        {paused && (
          <span className="text-xs text-[var(--text-secondary)]">Hover to pause scrolling</span>
        )}
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto overflow-y-hidden pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-1"
        style={{ scrollBehavior: 'auto' }}
      >
        {/* Render cards twice so there is always content to scroll (continuous loop) */}
        {[1, 2].map((copy) =>
          cards.map((party) => {
            const raised = totalRaised(party.slug);
            const pct = party.goalKes > 0 ? Math.min(100, (raised / party.goalKes) * 100) : 0;
            const acronym = party.name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 4)
              .toUpperCase();
            return (
              <div
                key={`${copy}-${party.slug}`}
                className="flex-shrink-0 w-[280px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] p-5 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: party.accent }}
                  >
                    {acronym.slice(0, 1)}
                  </div>
                  <div>
                    <p className="font-display font-bold text-lg">{acronym}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{party.name}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-1">
                  Leader: {party.leader} · Symbol: {party.symbol}
                </p>
                <p className="font-mono font-bold text-[var(--accent-1)] mb-2">
                  KES {formatKesM(raised)} raised
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-2 rounded-full bg-[var(--bg-primary)] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: party.accent,
                      }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold whitespace-nowrap">{Math.round(pct)}%</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">
                  of KES {formatKesM(party.goalKes)} goal
                </p>
                <button
                  type="button"
                  onClick={() => onDonate(party.slug)}
                  className="mt-auto py-2.5 px-4 rounded-lg text-white font-bold text-sm w-full transition-opacity hover:opacity-90"
                  style={{ backgroundColor: party.accent }}
                >
                  DONATE
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
