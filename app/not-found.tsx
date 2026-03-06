import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--bg-primary)]">
      <h1 className="font-display font-black text-6xl lg:text-8xl text-[var(--accent-1)]">
        404
      </h1>
      <p className="text-xl text-[var(--text-secondary)] mt-4">
        Page not found
      </p>
      <Link
        href="/en"
        className="mt-8 px-6 py-3 bg-[var(--accent-1)] text-white font-bold rounded-lg hover:opacity-90"
      >
        Go home
      </Link>
    </div>
  );
}
