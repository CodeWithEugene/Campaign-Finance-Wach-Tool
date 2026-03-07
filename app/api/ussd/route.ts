import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const categoryMap: Record<string, 'vote-buying' | 'illegal-donations' | 'misuse-public-resources' | 'undeclared-spending' | 'bribery' | 'other'> = {
  '1': 'vote-buying',
  '2': 'illegal-donations',
  '3': 'misuse-public-resources',
  '4': 'undeclared-spending',
  '5': 'bribery',
  '6': 'other',
};

type LangCode = 'en' | 'sw' | 'ki' | 'kam';

const USSD_STRINGS: Record<
  LangCode,
  {
    welcome: string;
    invalidLang: string;
    categoryMenu: string;
    invalidCategory: string;
    enterDescription: string;
    enterLocation: string;
    confirm: string;
    serviceUnavailable: string;
    thankYou: (id: string) => string;
    saveFailed: string;
    cancelled: string;
    sessionExpired: string;
    error: string;
  }
> = {
  en: {
    welcome: 'CON Welcome to Knight Watch\n1. English\n2. Kiswahili\n3. Kikuyu\n4. Kamba',
    invalidLang: 'CON Invalid. Select 1-4',
    categoryMenu:
      'CON Select category:\n1. Vote buying\n2. Illegal donations\n3. Misuse of public resources\n4. Undeclared spending\n5. Bribery\n6. Other',
    invalidCategory: 'CON Invalid category. Select 1-6',
    enterDescription: 'CON Enter brief description (max 160 chars):',
    enterLocation: 'CON Enter county or town:',
    confirm: 'CON Confirm? 1 Yes, 2 No',
    serviceUnavailable: 'END Service unavailable. Please try again later.',
    thankYou: (id) => `END Thank you. Report ID: ${id}. We will review it.`,
    saveFailed: 'END Sorry, we could not save your report. Please try again later.',
    cancelled: 'END Report cancelled.',
    sessionExpired: 'END Session expired. Please dial again.',
    error: 'END An error occurred. Please try again.',
  },
  sw: {
    welcome: 'CON Karibu Knight Watch\n1. English\n2. Kiswahili\n3. Kikuyu\n4. Kamba',
    invalidLang: 'CON Batili. Chagua 1-4',
    categoryMenu:
      'CON Chagua aina:\n1. Ununuzi wa kura\n2. Michango haramu\n3. Matumizi mabaya ya rasilimali\n4. Matumizi yasiyodhihirishwa\n5. Rushwa\n6. Nyingine',
    invalidCategory: 'CON Batili. Chagua 1-6',
    enterDescription: 'CON Andika maelezo mafupi (herufi 160):',
    enterLocation: 'CON Andika kaunti au mji:',
    confirm: 'CON Thibitisha? 1 Ndiyo, 2 Hapana',
    serviceUnavailable: 'END Huduma haipatikani. Tafadhali jaribu tena.',
    thankYou: (id) => `END Asante. Nambari ya ripoti: ${id}. Tutakagua.`,
    saveFailed: 'END Samahani, hatukuweza kuhifadhi ripoti. Tafadhali jaribu tena.',
    cancelled: 'END Ripoti imefutwa.',
    sessionExpired: 'END Muda umekwisha. Piga tena.',
    error: 'END Hitilafu imetokea. Tafadhali jaribu tena.',
  },
  ki: {
    welcome: 'CON Wĩkĩrĩre Knight Watch\n1. English\n2. Kiswahili\n3. Kikuyu\n4. Kamba',
    invalidLang: 'CON Ti wega. Hithia 1-4',
    categoryMenu:
      'CON Hithia mũhĩrĩro:\n1. Gūgura kura\n2. Mĩcango mĩũru\n3. Gũtumia rasilimali nĩ ũndũ mũũru\n4. Gũtumia tũthingu tũtarĩ na mũhĩrĩro\n5. Rũgongo\n6. Rĩngĩ',
    invalidCategory: 'CON Ti wega. Hithia 1-6',
    enterDescription: 'CON Thomora mũhĩrĩro mũgwanja (herufi 160):',
    enterLocation: 'CON Thomora kaunti kana thĩna:',
    confirm: 'CON Igũrũ? 1 Iĩ, 2 Tiga',
    serviceUnavailable: 'END Thandabũku ti ĩgũrũ. Ndũrũmĩrĩra ringĩ.',
    thankYou: (id) => `END Wĩ mwega. Nambari ya ripoti: ${id}. Tũkagũria.`,
    saveFailed: 'END Thaayũ, ti twĩhĩtwe gũhĩthĩkia ripoti. Ndũrũmĩrĩra ringĩ.',
    cancelled: 'END Ripoti yagĩrirwo.',
    sessionExpired: 'END Hĩndĩ ĩathiire. Thia ringĩ.',
    error: 'END Kĩũmbe kĩonekire. Ndũrũmĩrĩra ringĩ.',
  },
  kam: {
    welcome: 'CON Mũvaka Knight Watch\n1. English\n2. Kiswahili\n3. Kikuyu\n4. Kamba',
    invalidLang: 'CON Tene. Sya 1-4',
    categoryMenu:
      'CON Sya mũsango:\n1. Kũgula kura\n2. Mĩsango ya kũvũa\n3. Kũtumia vyũ na ũsũngi\n4. Kũtumia tũndũ twa kũvũa\n5. Kũvũa ndalama\n6. Ndingĩ',
    invalidCategory: 'CON Tene. Sya 1-6',
    enterDescription: 'CON Andika mũsango mũfupi (alafu 160):',
    enterLocation: 'CON Andika kaunti kana mũsyi:',
    confirm: 'CON Thibitisha? 1 Iĩ, 2 Aa',
    serviceUnavailable: 'END Ũtumĩa taũ nĩ ũvũ. Thĩĩa kĩla.',
    thankYou: (id) => `END Ngalo. Nambari ya ripoti: ${id}. Tũkavũa.`,
    saveFailed: 'END Thaayũ, ti twĩĩta kũsũngia ripoti. Thĩĩa kĩla.',
    cancelled: 'END Ripoti yasũngĩtwe.',
    sessionExpired: 'END Hĩndĩ yathi. Thia kĩla.',
    error: 'END Kĩũmbe kĩonekire. Thĩĩa kĩla.',
  },
};

function getLang(choice: string | undefined): LangCode {
  if (choice === '1') return 'en';
  if (choice === '2') return 'sw';
  if (choice === '3') return 'ki';
  if (choice === '4') return 'kam';
  return 'en';
}

/** GET: so you can verify the callback URL is reachable (e.g. open in browser). */
export async function GET() {
  return new NextResponse(
    'Knight Watch USSD callback. Use POST with sessionId, serviceCode, phoneNumber, text (Africa\'s Talking).',
    { headers: { 'Content-Type': 'text/plain' } }
  );
}

/** Get USSD 'text' from request body. Africa's Talking sends application/x-www-form-urlencoded. */
async function getUssdText(request: NextRequest): Promise<string> {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const body = await request.text();
    const params = new URLSearchParams(body);
    return params.get('text') ?? '';
  }
  const formData = await request.formData();
  const value = formData.get('text');
  return typeof value === 'string' ? value : '';
}

export async function POST(request: NextRequest) {
  try {
    const text = await getUssdText(request);
    const parts = text.split('*').filter(Boolean);
    const langChoice = parts[0];
    const lang = getLang(langChoice);
    const t = USSD_STRINGS[lang];

    let response: string;

    if (parts.length === 0) {
      response = t.welcome;
    } else if (parts.length === 1) {
      if (['1', '2', '3', '4'].includes(langChoice)) {
        response = t.categoryMenu;
      } else {
        response = t.invalidLang;
      }
    } else if (parts.length === 2) {
      const category = parts[1];
      if (['1', '2', '3', '4', '5', '6'].includes(category)) {
        response = t.enterDescription;
      } else {
        response = t.invalidCategory;
      }
    } else if (parts.length === 3) {
      response = t.enterLocation;
    } else if (parts.length === 4) {
      response = t.confirm;
    } else if (parts.length === 5) {
      const confirm = parts[4];
      if (confirm === '1') {
        const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
        if (!convexUrl) {
          response = t.serviceUnavailable;
        } else {
          const convex = new ConvexHttpClient(convexUrl);
          const categoryKey = parts[1];
          const description = (parts[2] || '').slice(0, 500);
          const location = (parts[3] || '').slice(0, 200);
          const category = categoryMap[categoryKey] || 'other';
          const title = description.slice(0, 80) || 'USSD Report';
          try {
            const reportId = await convex.mutation(api.reports.create, {
              title,
              description: description || 'No description provided.',
              category,
              location: location || 'Not specified',
              county: location || undefined,
              anonymous: true,
              source: 'ussd',
            });
            response = t.thankYou(reportId);
          } catch (e) {
            console.error('USSD Convex create error:', e);
            response = t.saveFailed;
          }
        }
      } else {
        response = t.cancelled;
      }
    } else {
      response = t.sessionExpired;
    }

    return new NextResponse(response, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('USSD error:', error);
    const t = USSD_STRINGS['en'];
    return new NextResponse(t.error, {
      headers: { 'Content-Type': 'text/plain' },
      status: 500,
    });
  }
}
