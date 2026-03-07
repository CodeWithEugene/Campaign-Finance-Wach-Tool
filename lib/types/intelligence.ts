import { Timestamp } from 'firebase/firestore'

export type ActivityType = 
  | 'rally' 
  | 'speech' 
  | 'donation-received' 
  | 'donation-given'
  | 'ad-spend' 
  | 'public-resource-misuse' 
  | 'statement' 
  | 'news'
  | 'profile'
  | 'corruption'
  | 'bribery'
  | 'ppf-allocation'
  | 'illegal-donations'
  | 'vote-buying'

export type ConfidenceLevel = 'verified' | 'reported' | 'alleged'

export interface ActivityItem {
  type: ActivityType
  headline: string
  summary: string
  source: string
  sourceUrl: string
  publishedAt: Date
  location: string | null
  locationLat: number | null
  locationLng: number | null
  amountMentioned: number | null
  rawText: string
  confidenceLevel: ConfidenceLevel
  photo?: string | null
}

export interface PartyMember {
  name: string
  photo: string | null
  position: string
  county: string
  electionYear: number
  source: string
  profileUrl: string
  personId?: string
}

export interface FinancialSignal {
  date: Date
  type: 'ad-spend' | 'donation-received' | 'donation-given' | 'ppf-allocation' | 'harambee' | 'estimated-spend'
  amountKes: number | null
  description: string
  source: string
  sourceUrl: string
  confidenceLevel: ConfidenceLevel
}

export interface RallyLocation {
  lat: number
  lng: number
  location: string
  date: Date
  headline: string
  source: string
  sourceUrl: string
  confidenceLevel: ConfidenceLevel
}

export interface PersonIntelligence {
  personName: string
  personId: string
  activities: ActivityItem[]
  totalActivities: number
  scrapedAt: Timestamp
  sources: string[]
  financialSignals: FinancialSignal[]
  rallyLocations: RallyLocation[]
  photoUrl: string | null
  wikipediaSummary: string | null
  position?: string
  party?: string
  county?: string
}

export interface PartyIntelligence {
  partyName: string
  partyId: string
  members: PartyMember[]
  activities: ActivityItem[]
  totalMembers: number
  scrapedAt: Timestamp
  sources: string[]
  adSpend: AdSpendRecord[]
}

export interface AdSpendRecord {
  date: Date
  platform: string
  amountKes: number | null
  adUrl: string
  description: string
}

export interface SearchResult {
  id: string
  name: string
  type: 'party' | 'person'
  subtitle: string
  photoUrl?: string
  slug?: string
}
