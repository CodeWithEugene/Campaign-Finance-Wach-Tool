import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import Fuse from 'fuse.js'
import { SearchResult } from '@/lib/types/intelligence'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'party' | 'person' | 'all'

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const results: SearchResult[] = []

    // Search parties
    if (type === 'party' || type === 'all' || !type) {
      const partiesSnap = await adminDb
        .collection('parties')
        .where('status', '==', 'active')
        .get()

      const parties = partiesSnap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        abbreviation: doc.data().abbreviation,
        logoUrl: doc.data().logoUrl,
      }))

      // Fuzzy search on parties
      const partyFuse = new Fuse(parties, {
        keys: ['name', 'abbreviation'],
        threshold: 0.3,
      })

      const partyMatches = partyFuse.search(query)
      results.push(...partyMatches.map(match => ({
        id: match.item.id,
        name: match.item.name,
        type: 'party' as const,
        subtitle: match.item.abbreviation,
        photoUrl: match.item.logoUrl,
        slug: match.item.abbreviation.toLowerCase(),
      })))
    }

    // Search candidates/politicians
    if (type === 'person' || type === 'all' || !type) {
      const candidatesSnap = await adminDb
        .collection('candidates')
        .limit(50)
        .get()

      const candidates = candidatesSnap.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        position: doc.data().position,
        party: doc.data().partyName,
        county: doc.data().county,
      }))

      // Fuzzy search on candidates
      const candidateFuse = new Fuse(candidates, {
        keys: ['name'],
        threshold: 0.4,
      })

      const candidateMatches = candidateFuse.search(query)
      results.push(...candidateMatches.map(match => ({
        id: match.item.id,
        name: match.item.name,
        type: 'person' as const,
        subtitle: `${match.item.position} - ${match.item.party}`,
        photoUrl: undefined,
      })))
    }

    // Sort by relevance (exact matches first)
    const sorted = results.sort((a, b) => {
      const aExact = a.name.toLowerCase() === query.toLowerCase()
      const bExact = b.name.toLowerCase() === query.toLowerCase()
      if (aExact && !bExact) return -1
      if (!aExact && bExact) return 1
      return 0
    })

    // Add "Search the web" option if no exact match
    const hasExactMatch = sorted.some(r => 
      r.name.toLowerCase() === query.toLowerCase()
    )

    if (!hasExactMatch && sorted.length === 0) {
      sorted.push({
        id: 'web-search',
        name: `Search the web for "${query}"`,
        type: 'person',
        subtitle: 'Scrape public sources',
      })
    }

    return NextResponse.json({ 
      results: sorted.slice(0, 10),
      query,
      total: sorted.length 
    })
  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json({ 
      error: 'Search failed',
      details: error.message 
    }, { status: 500 })
  }
}
