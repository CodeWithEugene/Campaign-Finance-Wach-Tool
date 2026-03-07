import { adminDb } from '@/lib/firebase/admin'
import { Report, ReportStatus } from '@/lib/types/firestore'

export async function createReport(data: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) {
  const ref = await adminDb.collection('reports').add({
    ...data,
    status: 'submitted',
    trustScore: data.submissionChannel === 'web' ? 40 : 50,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return ref.id
}

export async function getPublicReports(filters: {
  county?: string
  category?: string
  status?: ReportStatus
  limit?: number
}) {
  let query = adminDb.collection('reports')
    .where('status', 'in', ['verified', 'under-review'])
    .orderBy('createdAt', 'desc')
    .limit(filters.limit ?? 50)

  if (filters.county) {
    query = query.where('county', '==', filters.county) as any
  }
  if (filters.category) {
    query = query.where('category', '==', filters.category) as any
  }

  const snap = await query.get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Report))
}

export async function getReportById(reportId: string) {
  const doc = await adminDb.collection('reports').doc(reportId).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() } as Report
}

export async function updateReportStatus(
  reportId: string,
  reviewerId: string,
  reviewerName: string,
  previousStatus: string,
  newStatus: ReportStatus,
  internalNote: string,
  publicNote: string
) {
  const batch = adminDb.batch()

  const reportRef = adminDb.doc(`reports/${reportId}`)
  batch.update(reportRef, { status: newStatus, updatedAt: new Date() })

  const reviewRef = adminDb.collection(`reports/${reportId}/reviews`).doc()
  batch.set(reviewRef, {
    reviewerId,
    reviewerName,
    previousStatus,
    newStatus,
    internalNote,
    publicNote,
    createdAt: new Date(),
  })

  await batch.commit()
}

export async function getReportReviews(reportId: string) {
  const snap = await adminDb.collection(`reports/${reportId}/reviews`)
    .orderBy('createdAt', 'desc')
    .get()
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function enforceRateLimit(identifier: string, maxPerDay: number): Promise<void> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const countSnap = await adminDb.collection('reports')
    .where('ipHash', '==', identifier)
    .where('createdAt', '>=', today)
    .get()
  
  if (countSnap.size >= maxPerDay) {
    throw new Error('Daily report limit reached')
  }
}
