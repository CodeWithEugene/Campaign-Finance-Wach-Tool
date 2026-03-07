'use client';

import { ThemeProvider } from 'next-themes';
import { ConvexClientProvider } from './ConvexClientProvider';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <ConvexClientProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </ConvexClientProvider>
    </SessionProvider>
  );
}
