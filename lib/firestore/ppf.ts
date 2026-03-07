import { adminDb } from '@/lib/firebase/admin'
import { PPFAllocation } from '@/lib/types/firestore'

export async function getPPFAllocations(partyId?: string, year?: string) {
  let query = adminDb.collection('ppfAllocations').orderBy('year', 'desc')

  if (partyId) {
    query = query.where('partyId', '==', partyId) as any
  }
  if (year) {
    query = query.where('year', '==', year) as any
  }

  const snap = await query.get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as PPFAllocation))
}

export async function upsertPPFAllocation(data: Omit<PPFAllocation, 'parsedAt'>) {
  const existing = await adminDb.collection('ppfAllocations')
    .where('partyId', '==', data.partyId)
    .where('year', '==', data.year)
    .get()

  if (!existing.empty) {
    await existing.docs[0].ref.update({
      ...data,
      parsedAt: new Date(),
    })
    return existing.docs[0].id
  }

  const ref = await adminDb.collection('ppfAllocations').add({
    ...data,
    parsedAt: new Date(),
  })
  return ref.id
}

export function calculatePPFAllocation(params: {
  totalPool: number
  partyVotes: number
  totalVotes: number
  partyReps: number
  totalReps: number
  partySigReps: number
  totalSigReps: number
}) {
  const adminDeduction = params.totalPool * 0.05
  const distributablePool = params.totalPool - adminDeduction

  const votesShare = (params.partyVotes / params.totalVotes) * 0.70 * distributablePool
  const repsShare = (params.partyReps / params.totalReps) * 0.10 * distributablePool
  const sigShare = (params.partySigReps / params.totalSigReps) * 0.15 * distributablePool

  return {
    estimatedAllocation: votesShare + repsShare + sigShare,
    breakdown: {
      votesShare,
      repsShare,
      sigShare,
      adminDeduction,
    }
  }
}
