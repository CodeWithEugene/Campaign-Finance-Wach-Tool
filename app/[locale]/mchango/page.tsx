'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';

interface PartyFundraising {
  id: string;
  name: string;
  shortName: string;
  leader: string;
  symbol: string;
  raised: number;
  goal: number;
  color: string;
}

const parties: PartyFundraising[] = [
  { 
    id: 'uda', 
    name: 'United Democratic Alliance',
    shortName: 'UDA',
    leader: 'William Ruto',
    symbol: 'Wheelbarrow',
    raised: 28365000,
    goal: 400000000,
    color: '#FFD700'
  },
  { 
    id: 'odm', 
    name: 'Orange Democratic Movement',
    shortName: 'ODM',
    leader: 'Oburu Odinga',
    symbol: 'Orange',
    raised: 1051992000,
    goal: 600000000,
    color: '#FF6B00'
  },
  { 
    id: 'jubilee', 
    name: 'Jubilee Party',
    shortName: 'JUBILEE',
    leader: 'Uhuru Kenyatta',
    symbol: 'Dove',
    raised: 4673610250,
    goal: 7000000000,
    color: '#DC143C'
  },
  { 
    id: 'wiper', 
    name: 'Wiper Democratic Movement',
    shortName: 'WDM-K',
    leader: 'Kalonzo Musyoka',
    symbol: 'Umbrella',
    raised: 89500000,
    goal: 350000000,
    color: '#0099CC'
  },
  { 
    id: 'anc', 
    name: 'Amani National Congress',
    shortName: 'ANC',
    leader: 'Musalia Mudavadi',
    symbol: 'Lamp',
    raised: 156000000,
    goal: 450000000,
    color: '#006633'
  },
  { 
    id: 'ford-kenya', 
    name: 'Forum for the Restoration of Democracy – Kenya',
    shortName: 'FORD-K',
    leader: 'Moses Wetangula',
    symbol: 'Lion',
    raised: 72300000,
    goal: 300000000,
    color: '#FFB800'
  },
  { 
    id: 'kanu', 
    name: 'Kenya African National Union',
    shortName: 'KANU',
    leader: 'Gideon Moi',
    symbol: 'Cockerel',
    raised: 234000000,
    goal: 500000000,
    color: '#000000'
  },
];

export default function MchangoPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [selectedParty, setSelectedParty] = useState('');
  const [amount, setAmount] = useState(100);
  const [submitting, setSubmitting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const minAmount = 100;
  const maxAmount = 1000000;

  // Infinite scroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5; // pixels per frame

    const animate = () => {
      scrollPosition += scrollSpeed;
      
      // Reset scroll position when we've scrolled past the first set of cards
      const cardWidth = 320 + 24; // card width + gap
      const totalWidth = cardWidth * parties.length;
      
      if (scrollPosition >= totalWidth) {
        scrollPosition = 0;
      }
      
      container.scrollLeft = scrollPosition;
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameId = requestAnimationFrame(animate);

    // Pause on hover
    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const handleMouseLeave = () => {
      animationFrameId = requestAnimationFrame(animate);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleDonate = (partyId: string) => {
    setSelectedParty(partyId);
    setSubmitting(true);
    // In production, integrate Paystack here
    // For now, simulate success
    setTimeout(() => {
      router.push(`/${locale}/mchango/success?amount=${amount}&party=${partyId}`);
    }, 1500);
  };

  const getPercentage = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="mb-12">
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Mchango — Political Party Crowdfunding
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Support political parties transparently. All contributions are publicly recorded and comply with Kenyan electoral law.
        </p>

        {/* Party Fundraising Cards - Infinite Horizontal Scroll */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-xl">Political Parties</h2>
            <p className="text-sm text-[var(--text-secondary)]">Hover to pause scrolling</p>
          </div>
          
          <div 
            ref={scrollContainerRef}
            className="overflow-x-hidden pb-4 -mx-4 px-4"
            style={{ scrollBehavior: 'auto' }}
          >
            <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
              {/* Render parties twice for seamless loop */}
              {[...parties, ...parties].map((party, index) => {
                const percentage = getPercentage(party.raised, party.goal);
                
                return (
                  <Card 
                    key={`${party.id}-${index}`}
                    className="flex-shrink-0 w-80 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleDonate(party.id)}
                  >
                    {/* Party Header with Logo */}
                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                        style={{ backgroundColor: party.color }}
                      >
                        {party.shortName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{party.shortName}</h3>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{party.name}</p>
                      </div>
                    </div>

                    {/* Leader and Symbol */}
                    <div className="mb-4 text-sm">
                      <p className="text-[var(--text-secondary)]">
                        <span className="font-medium">Leader:</span> {party.leader}
                      </p>
                      <p className="text-[var(--text-secondary)]">
                        <span className="font-medium">Symbol:</span> {party.symbol}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">
                          KES {(party.raised / 1000000).toFixed(1)}M
                        </span>
                        <span className="text-[var(--text-secondary)]">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: party.color
                          }}
                        />
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-1">
                        raised of KES {(party.goal / 1000000).toFixed(0)}M goal
                      </p>
                    </div>

                    {/* Donate Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDonate(party.id);
                      }}
                      className="w-full py-3 rounded-lg font-bold text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: party.color }}
                    >
                      DONATE
                    </button>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legal Compliance Notice */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-3">Legal Compliance & Transparency</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">Contribution Rules:</h4>
                <ul className="space-y-1">
                  <li>• All contributions are publicly recorded</li>
                  <li>• No foreign donations accepted</li>
                  <li>• Must comply with campaign finance limits</li>
                  <li>• Anonymous donations not permitted</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Information:</h4>
                <ul className="space-y-1">
                  <li>• Secure payment via Paystack</li>
                  <li>• M-Pesa and card payments accepted</li>
                  <li>• Instant receipt and confirmation</li>
                  <li>• Full transparency and audit trail</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
