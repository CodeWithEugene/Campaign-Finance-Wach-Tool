'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';

export default function CalculatorPage() {
  const [votes, setVotes] = useState(1000000);
  const [totalVotes, setTotalVotes] = useState(14000000);
  const [reps, setReps] = useState(50);
  const [totalReps, setTotalReps] = useState(350);
  const [sig, setSig] = useState(5);
  const [totalSig, setTotalSig] = useState(50);
  const [pool, setPool] = useState(1000);

  const poolAfterAdmin = pool * 0.95;
  const share70 = totalVotes > 0 ? (votes / totalVotes) * 0.7 * poolAfterAdmin : 0;
  const share10 = totalReps > 0 ? (reps / totalReps) * 0.1 * poolAfterAdmin : 0;
  const share15 = totalSig > 0 ? (sig / totalSig) * 0.15 * poolAfterAdmin : 0;
  const estimated = share70 + share10 + share15;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          PPF Formula Calculator
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Estimate Political Parties Fund allocation. Adjust the inputs to see
          &quot;what if&quot; scenarios.
        </p>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <h2 className="font-display font-bold text-xl mb-6">Inputs</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Party votes / Total votes
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={votes}
                    onChange={(e) => setVotes(Number(e.target.value))}
                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
                  />
                  <span className="flex items-center">/</span>
                  <input
                    type="number"
                    value={totalVotes}
                    onChange={(e) => setTotalVotes(Number(e.target.value))}
                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Party reps / Total reps
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
                  />
                  <span className="flex items-center">/</span>
                  <input
                    type="number"
                    value={totalReps}
                    onChange={(e) => setTotalReps(Number(e.target.value))}
                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Party SIG / Total SIG
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={sig}
                    onChange={(e) => setSig(Number(e.target.value))}
                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
                  />
                  <span className="flex items-center">/</span>
                  <input
                    type="number"
                    value={totalSig}
                    onChange={(e) => setTotalSig(Number(e.target.value))}
                    className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Total PPF pool (KSh M)
                </label>
                <input
                  type="number"
                  value={pool}
                  onChange={(e) => setPool(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-6">Result</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">70% share (votes)</p>
                <p className="font-mono font-bold text-lg">KSh {share70.toFixed(2)}M</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">10% share (reps)</p>
                <p className="font-mono font-bold text-lg">KSh {share10.toFixed(2)}M</p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">15% share (SIG)</p>
                <p className="font-mono font-bold text-lg">KSh {share15.toFixed(2)}M</p>
              </div>
              <div className="pt-4 border-t border-[var(--border-color)]">
                <p className="text-sm text-[var(--text-secondary)]">Estimated allocation</p>
                <p className="font-display font-black text-3xl text-[var(--accent-1)]">
                  KSh {estimated.toFixed(2)}M
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
