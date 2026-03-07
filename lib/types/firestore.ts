import { Timestamp } from 'firebase/firestore'

export interface Party {
  id: string
  name: string
  abbreviation: string
  registeredDate: Timestamp
  status: 'active' | 'deregistered'
  logoUrl: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface PPFAllocation {
  partyId: string
  partyName: string
  year: string
  amountKes: number
  sourceUrl: string
  parsedAt: Timestamp
}

export interface Candidate {
  name: string
  partyId: string
  partyName: string
  position: 'President' | 'Governor' | 'Senator' | 'MP' | 'WomenRep' | 'MCA'
  constituency: string
  county: string
  electionYear: number
  createdAt: Timestamp
}

export type ReportCategory = 
  | 'vote-buying' 
  | 'illegal-donations' 
  | 'public-resource-misuse' 
  | 'undeclared-spending' 
  | 'bribery' 
  | 'other'

export type ReportStatus = 
  | 'submitted' 
  | 'under-review' 
  | 'verified' 
  | 'unverified' 
  | 'needs-more-info'

export interface Report {
  id: string
  title: string
  description: string
  category: ReportCategory
  subcategory: string
  tags: string[]
  county: string
  constituency: string
  locationText: string
  locationLat: number | null
  locationLng: number | null
  incidentDate: Timestamp | null
  status: ReportStatus
  trustScore: number
  submissionChannel: 'web' | 'sms' | 'ussd'
  isAnonymous: boolean
  submitterEmailHash: string | null
  ipHash: string
  mediaUrls: string[]
  thumbnailUrls: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ReportReview {
  reviewerId: string
  reviewerName: string
  previousStatus: string
  newStatus: string
  internalNote: string
  publicNote: string
  createdAt: Timestamp
}

export interface AlertSubscription {
  email: string
  county: string
  frequency: 'daily' | 'weekly' | 'verified-only'
  confirmed: boolean
  confirmToken: string
  createdAt: Timestamp
}

export interface TransparencyScore {
  partyId: string
  partyName: string
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  disclosureScore: number
  ppfComplianceScore: number
  reportVolumeScore: number
  verificationRateScore: number
  calculatedAt: Timestamp
}

export interface USSDSession {
  phoneNumber: string
  step: number
  language: 'en' | 'sw'
  category?: string
  description?: string
  location?: string
  expiresAt: Timestamp
}

export interface AdminUser {
  uid: string
  email: string
  name: string
  role: 'reviewer' | 'admin'
  createdAt: Timestamp
}

// Intelligence Module Types
export interface PersonIntelligenceDoc {
  personName: string
  personId: string
  activities: any[]
  totalActivities: number
  scrapedAt: Timestamp
  sources: string[]
  financialSignals: any[]
  rallyLocations: any[]
  photoUrl: string | null
  wikipediaSummary: string | null
  position?: string
  party?: string
  county?: string
}

export interface PartyIntelligenceDoc {
  partyName: string
  partyId: string
  members: any[]
  activities: any[]
  totalMembers: number
  scrapedAt: Timestamp
  sources: string[]
  adSpend: any[]
}

export interface SearchCacheDoc {
  query: string
  type: 'party' | 'person'
  results: any[]
  cachedAt: Timestamp
  expiresAt: Timestamp
}
