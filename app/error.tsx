'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--bg-primary)]">
      <h1 className="font-display font-black text-3xl lg:text-4xl text-[var(--accent-2)]">
        Something went wrong
      </h1>
      <p className="text-[var(--text-secondary)] mt-4 text-center">
        An error occurred. Please try again.
      </p>
      <div className="flex gap-4 mt-8">
        <button
          onClick={reset}
          className="px-6 py-3 bg-[var(--accent-1)] text-white font-bold rounded-lg hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/en"
          className="px-6 py-3 border border-[var(--border-color)] font-bold rounded-lg hover:border-[var(--accent-1)]"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
