/**
 * Kenyan languages supported by the platform.
 * Code is used in the URL path (/code/...). Name is shown in the language dropdown.
 */
export const KENYAN_LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'ki', name: 'Gĩkũyũ (Kikuyu)' },
  { code: 'kam', name: 'Kikamba (Kamba)' },
  { code: 'luy', name: 'Oluluhya (Luhya)' },
  { code: 'luo', name: 'Dholuo (Luo)' },
  { code: 'kln', name: 'Kalenjin' },
  { code: 'so', name: 'Soomaali (Somali)' },
  { code: 'mas', name: 'Maa (Maasai)' },
  { code: 'mer', name: 'Kimeru (Meru)' },
  { code: 'tuv', name: 'Ng\'aturkana (Turkana)' },
  { code: 'ebu', name: 'Kiembu (Embu)' },
  { code: 'guz', name: 'Ekegusii (Kisii)' },
  { code: 'dav', name: 'Kitaita (Taita)' },
  { code: 'pko', name: 'Pokoot (Pokot)' },
  { code: 'kuj', name: 'Kikuria (Kuria)' },
  { code: 'sxb', name: 'Olusuba (Suba)' },
  { code: 'gax', name: 'Afaan Borana (Borana)' },
  { code: 'rel', name: 'Rendille' },
  { code: 'saq', name: 'Kisampur (Samburu)' },
  { code: 'nyf', name: 'Mijikenda' },
  { code: 'ssp', name: 'Ilchamus' },
] as const;

export type LocaleCode = (typeof KENYAN_LOCALES)[number]['code'];

export const LOCALE_CODES = KENYAN_LOCALES.map((l) => l.code);

export function getLocaleName(code: string): string {
  return KENYAN_LOCALES.find((l) => l.code === code)?.name ?? code;
}
