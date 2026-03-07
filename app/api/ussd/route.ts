import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'

const CATEGORIES: Record<string, string> = {
  '1': 'vote-buying',
  '2': 'illegal-donations',
  '3': 'public-resource-misuse',
  '4': 'undeclared-spending',
  '5': 'bribery',
  '6': 'other',
}

const CATEGORY_LABELS_EN = `1. Vote buying\n2. Alleged illegal donations\n3. Alleged misuse of public resources\n4. Undeclared spending\n5. Alleged bribery of officials\n6. Other`
const CATEGORY_LABELS_SW = `1. Kununua kura\n2. Michango haramu\n3. Matumizi mabaya ya rasilimali\n4. Matumizi yasiyotangazwa\n5. Rushwa kwa maafisa\n6. Nyingine`

export async function POST(req: NextRequest) {
  const body = await req.formData()
  const sessionId = body.get('sessionId') as string
  const phoneNumber = body.get('phoneNumber') as string
  const text = (body.get('text') as string) ?? ''

  const inputs = text ? text.split('*') : []
  const step = inputs.length

  const sessionRef = adminDb.collection('ussdSessions').doc(sessionId)

  try {
    switch (step) {
      case 0:
        await sessionRef.set({
          phoneNumber,
          step: 0,
          language: 'en',
          expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        })
        return ussdResponse('CON', `Welcome to FedhaWatch\nCampaign Finance Watch Tool\n\nSelect language:\n1. English\n2. Kiswahili`)

      case 1: {
        const lang = inputs[0] === '2' ? 'sw' : 'en'
        await sessionRef.update({ language: lang, step: 1 })
        const cats = lang === 'sw' ? CATEGORY_LABELS_SW : CATEGORY_LABELS_EN
        const prompt = lang === 'sw' ? 'Chagua aina ya ripoti:' : 'Select report category:'
        return ussdResponse('CON', `${prompt}\n${cats}`)
      }

      case 2: {
        if (!CATEGORIES[inputs[1]]) {
          return ussdResponse('CON', `Invalid selection.\n${CATEGORY_LABELS_EN}`)
        }
        await sessionRef.update({ category: CATEGORIES[inputs[1]], step: 2 })
        const session = (await sessionRef.get()).data()
        const prompt = session?.language === 'sw'
          ? 'Andika maelezo mafupi (herufi 160 za juu):'
          : 'Enter brief description (max 160 characters):'
        return ussdResponse('CON', prompt)
      }

      case 3: {
        const description = inputs[2].slice(0, 160)
        await sessionRef.update({ description, step: 3 })
        const session = (await sessionRef.get()).data()
        const prompt = session?.language === 'sw'
          ? 'Ingiza kaunti au mji wako:'
          : 'Enter your county or town:'
        return ussdResponse('CON', prompt)
      }

      case 4: {
        await sessionRef.update({ location: inputs[3], step: 4 })
        const session = (await sessionRef.get()).data()
        const prompt = session?.language === 'sw'
          ? 'Thibitisha?\n1. Ndiyo, tuma ripoti\n2. Hapana, ghairi'
          : 'Confirm submission?\n1. Yes, submit report\n2. No, cancel'
        return ussdResponse('CON', prompt)
      }

      case 5: {
        const session = (await sessionRef.get()).data()
        if (inputs[4] !== '1') {
          await sessionRef.delete()
          const msg = session?.language === 'sw'
            ? 'Ripoti imeghairiwa. Asante.'
            : 'Report cancelled. Thank you.'
          return ussdResponse('END', msg)
        }

        // Create report
        const reportRef = await adminDb.collection('reports').add({
          title: `USSD Report: ${session?.category}`,
          description: session?.description ?? '',
          category: session?.category ?? 'other',
          subcategory: '',
          tags: [],
          county: session?.location ?? '',
          constituency: '',
          locationText: session?.location ?? '',
          locationLat: null,
          locationLng: null,
          incidentDate: null,
          status: 'submitted',
          trustScore: 50,
          submissionChannel: 'ussd',
          isAnonymous: true,
          submitterEmailHash: null,
          ipHash: phoneNumber.slice(-4),
          mediaUrls: [],
          thumbnailUrls: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        await sessionRef.delete()

        const reportId = reportRef.id.slice(0, 8).toUpperCase()
        const msg = session?.language === 'sw'
          ? `Asante. Nambari ya ripoti: ${reportId}. Tutaipitia. FedhaWatch.`
          : `Thank you. Report ID: ${reportId}. We will review it. FedhaWatch.`
        return ussdResponse('END', msg)
      }

      default:
        return ussdResponse('END', 'Session expired. Please dial again.')
    }
  } catch (error) {
    console.error('USSD error:', error)
    return ussdResponse('END', 'An error occurred. Please try again.')
  }
}

function ussdResponse(type: 'CON' | 'END', message: string) {
  return new Response(`${type} ${message}`, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
