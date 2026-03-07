import type { Metadata } from 'next';
import { DM_Sans, Source_Sans_3, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import { SkipLink } from '@/components/layout/SkipLink';
import { AccessibilityWidget } from '@/components/AccessibilityWidget';
import './globals.css';
import 'leaflet/dist/leaflet.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-display',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Campaign Finance Watch Tool | TI-Kenya',
  description:
    'Track political financing, visualize campaign finance data, and monitor misuse of public resources in Kenya.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${sourceSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          <SkipLink />
          {children}
          <AccessibilityWidget />
        </Providers>
      </body>
    </html>
  );
}
