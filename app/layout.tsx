import type { Metadata } from 'next';
import Script from 'next/script';
import { DM_Sans, Source_Sans_3, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import { SkipLink } from '@/components/layout/SkipLink';
import { AccessibilityWidget } from '@/components/AccessibilityWidget';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import './globals.css';
import 'leaflet/dist/leaflet.css';

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && d)) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {}
})();
`;

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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://campaign-finance-wach-tool.vercel.app';
const ogImage = `${siteUrl}/images/icon/icon.png`;

export const metadata: Metadata = {
  title: 'Campaign Finance Watch Tool | TI-Kenya',
  description:
    'Track political financing, visualize campaign finance data, and monitor misuse of public resources in Kenya.',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Campaign Finance Watch Tool | TI-Kenya',
    title: 'Campaign Finance Watch Tool | TI-Kenya',
    description:
      'Track political financing, visualize campaign finance data, and monitor misuse of public resources in Kenya.',
    images: [{ url: ogImage, width: 512, height: 512, alt: 'Campaign Finance Watch Tool' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campaign Finance Watch Tool | TI-Kenya',
    description:
      'Track political financing, visualize campaign finance data, and monitor misuse of public resources in Kenya.',
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      <body
        className={`${dmSans.variable} ${sourceSans.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        <Providers>
          <SkipLink />
          {children}
          <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-1">
            <AccessibilityWidget />
            <ChatbotWidget />
          </div>
        </Providers>
      </body>
    </html>
  );
}
