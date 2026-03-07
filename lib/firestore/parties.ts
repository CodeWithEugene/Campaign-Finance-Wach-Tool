import { adminDb } from '@/lib/firebase/admin'
import { Party } from '@/lib/types/firestore'

export async function getAllParties() {
  const snap = await adminDb.collection('parties')
    .where('status', '==', 'active')
    .orderBy('name', 'asc')
    .get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Party))
}

export async function getPartyById(partyId: string) {
  const doc = await adminDb.collection('parties').doc(partyId).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() } as Party
}

export async function createParty(data: Omit<Party, 'id' | 'createdAt' | 'updatedAt'>) {
  const ref = await adminDb.collection('parties').add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return ref.id
}
