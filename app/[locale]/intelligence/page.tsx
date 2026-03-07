'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Users, User, TrendingUp, Clock } from 'lucide-react'
import { SearchResult } from '@/lib/types/intelligence'

const POPULAR_PARTIES = [
  'ODM', 'UDA', 'Jubilee', 'Azimio', 'Wiper', 'ANC', 'FORD-K', 'KNC', 'PNU', 'UPIA'
]

const POPULAR_POLITICIANS = [
  'Raila Odinga', 'William Ruto', 'Uhuru Kenyatta', 'Martha Karua',
  'Kalonzo Musyoka', 'Musalia Mudavadi', 'Eugene Wamalwa', 'Rigathi Gachagua',
  'Hassan Joho', 'Mike Sonko', 'Johnson Sakaja', 'Anne Waiguru',
  'Ferdinand Waititu', 'Alfred Mutua', 'Charity Ngilu', 'Gladys Wanga',
  'James Orengo', 'Aden Duale', 'Moses Wetangula', 'Kimani Ichungwah'
]

export default function IntelligencePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'parties' | 'politicians'>('parties')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const recent = localStorage.getItem('recentSearches')
    if (recent) {
      setRecentSearches(JSON.parse(recent))
    }
  }, [])

  // Live search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true)
      try {
        const type = searchType === 'parties' ? 'party' : 'person'
        const res = await fetch(`/api/intelligence/search?q=${encodeURIComponent(searchQuery)}&type=${type}`)
        const data = await res.json()
        setResults(data.results || [])
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery, searchType])

  const handleSearch = (query: string, result?: SearchResult) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))

    // Navigate based on result type
    const searchResult = result || results.find(r => r.name.toLowerCase() === query.toLowerCase())
    if (searchResult) {
      if (searchResult.type === 'party') {
        router.push(`/en/intelligence/party/${searchResult.slug || searchResult.id}`)
      } else {
        router.push(`/en/intelligence/person/${searchResult.id}`)
      }
    } else if (query.length > 0) {
      // Create a person ID from the query
      const personId = query.toLowerCase().replace(/\s+/g, '-')
      router.push(`/en/intelligence/person/${personId}`)
    }
  }

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term)
    // Wait for search results to populate
    setTimeout(() => {
      const result = results.find(r => r.name.toLowerCase() === term.toLowerCase())
      handleSearch(term, result)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Political Intelligence Module
          </h1>
          <p className="text-lg text-gray-600">
            Search for any political party or politician to view comprehensive intelligence from public sources
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              placeholder="Search a party (e.g. ODM) or politician (e.g. Raila Odinga)..."
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Toggle Tabs */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setSearchType('parties')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                searchType === 'parties'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Users className="inline w-5 h-5 mr-2" />
              Parties
            </button>
            <button
              onClick={() => setSearchType('politicians')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                searchType === 'politicians'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <User className="inline w-5 h-5 mr-2" />
              Politicians
            </button>
          </div>

          {/* Autocomplete Results */}
          {searchQuery.length >= 2 && (
            <div className="mt-4 border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">Searching...</div>
              ) : results.length > 0 ? (
                results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSearch(result.name, result)}
                    className="w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center gap-4"
                  >
                    {result.photoUrl && (
                      <img src={result.photoUrl} alt={result.name} className="w-12 h-12 rounded-full object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{result.name}</div>
                      <div className="text-sm text-gray-500">{result.subtitle}</div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {result.type}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No results found. Try searching the web.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickSearch(search)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Popular {searchType === 'parties' ? 'Parties' : 'Politicians'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {(searchType === 'parties' ? POPULAR_PARTIES : POPULAR_POLITICIANS).map((term) => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <Users className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Search a Party</h3>
            <p className="text-gray-600">
              View all party members, PPF funding history, campaign activities, transparency scores, and aggregated intelligence from public sources.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <User className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Search a Politician</h3>
            <p className="text-gray-600">
              Track rallies, campaign spending, news mentions, financial signals, and public activities scraped from news outlets and official sources.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-2">Data Sources & Disclaimer</h4>
          <p className="text-sm text-yellow-800">
            FedhaWatch aggregates publicly available information from news outlets, government websites, and public social media for civic accountability purposes. All data shown is sourced from public records. Allegations are labeled as such. For corrections or takedown requests, contact: intelligence@fedhawatch.org
          </p>
        </div>
      </div>
    </div>
  )
}
