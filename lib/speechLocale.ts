/**
 * Maps app locale codes to BCP-47 language tags for Web Speech API
 * (SpeechRecognition and speechSynthesis). Browsers support a subset of these;
 * unsupported locales fall back to en-KE or en.
 */

export const LOCALE_TO_SPEECH_LANG: Record<string, string> = {
  en: 'en-KE',
  sw: 'sw-KE',
  ki: 'en-KE', // Kikuyu – browser rarely has; fallback English
  kam: 'en-KE',
  luy: 'en-KE',
  luo: 'en-KE',
  kln: 'en-KE',
  so: 'so-SO', // Somali – sometimes available
  mas: 'en-KE',
  mer: 'en-KE',
  tuv: 'en-KE',
  ebu: 'en-KE',
  guz: 'en-KE',
  dav: 'en-KE',
  pko: 'en-KE',
  kuj: 'en-KE',
  sxb: 'en-KE',
  gax: 'en-KE',
  rel: 'en-KE',
  saq: 'en-KE',
  nyf: 'en-KE',
  ssp: 'en-KE',
};

export function getSpeechLang(locale: string): string {
  return LOCALE_TO_SPEECH_LANG[locale] ?? 'en-KE';
}

/** Get the best available TTS voice for a BCP-47 lang (e.g. en-KE, sw-KE). */
export function getVoiceForLang(speechLang: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  const lang = speechLang.toLowerCase();
  const exact = voices.find((v) => v.lang.toLowerCase() === lang);
  if (exact) return exact;
  const base = lang.split('-')[0];
  const sameLang = voices.find((v) => v.lang.toLowerCase().startsWith(base));
  return sameLang ?? voices.find((v) => v.default) ?? voices[0] ?? null;
}
