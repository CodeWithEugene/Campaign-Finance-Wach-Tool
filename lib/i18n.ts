export const messages: Record<string, Record<string, string>> = {
  en: {
    'nav.learn': 'Learn',
    'nav.report': 'Report',
    'nav.mchango': 'Mchango',
    'nav.map': 'Map',
    'nav.dashboard': 'Dashboard',
    'nav.reports': 'Reports',
    'nav.transparency': 'Transparency',
    'nav.calculator': 'Calculator',
    'home.title': 'Campaign Finance Watch Tool',
    'home.subtitle': 'Track political financing, visualize campaign finance data, and monitor misuse of public resources in Kenya.',
    'home.report': 'Report Misuse',
    'home.learn': 'Learn More',
  },
  sw: {
    'nav.learn': 'Jifunze',
    'nav.report': 'Ripoti',
    'nav.mchango': 'Mchango',
    'nav.map': 'Ramani',
    'nav.dashboard': 'Dashibodi',
    'nav.reports': 'Ripoti',
    'nav.transparency': 'Uwazi',
    'nav.calculator': 'Kikokotoo',
    'home.title': 'Kifaa cha Uangalizi wa Ufadhili wa Kampeni',
    'home.subtitle': 'Fuatilia ufadhili wa kisiasa, onyesha data ya ufadhili wa kampeni, na uangalie matumizi mabaya ya rasilimali za umma nchini Kenya.',
    'home.report': 'Ripoti Matumizi Mabaya',
    'home.learn': 'Jifunze Zaidi',
  },
};

export function getMessage(locale: string, key: string): string {
  return messages[locale]?.[key] || messages.en[key] || key;
}
