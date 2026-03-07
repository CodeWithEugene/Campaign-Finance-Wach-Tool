import { EmbedAwareLayout } from '@/components/layout/EmbedAwareLayout';
import { LOCALE_CODES } from '@/lib/locales';

export function generateStaticParams() {
  return LOCALE_CODES.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return <EmbedAwareLayout>{children}</EmbedAwareLayout>;
}
