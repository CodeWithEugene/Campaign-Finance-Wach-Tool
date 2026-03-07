'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

export function EmbedAwareLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEmbed = pathname?.includes('/embed');
  if (isEmbed) {
    return <div className="min-h-screen bg-[var(--bg-primary)]">{children}</div>;
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
