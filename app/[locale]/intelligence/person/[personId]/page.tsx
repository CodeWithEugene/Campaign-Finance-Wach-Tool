'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  RefreshCw, 
  MapPin, 
  DollarSign, 
  Newspaper, 
  Calendar,
  ExternalLink,
  TrendingUp,
  AlertCircle,
  Download,
  Clock
} from 'lucide-react'
import { PersonIntelligence, ActivityItem } from '@/lib/types/intelligence'
import { formatDistanceToNow } from 'date-fns'

export default function PersonProfilePage() {
  const params = useParams()
  const personId = params.personId as string
  
  const [intelligence, setIntelligence] = useState<PersonIntelligence | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isScraping, setIsScraping] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'rallies' | 'financial' | 'news'>('all')
  const [campaignPeriod, setCampaignPeriod] = useState<string>('all')

  // Campaign periods
  const campaignPeriods = [
    { value: 'all', label: 'All Time', start: '2017-01-01', end: new Date().toISOString().split('T')[0] },
    { value: '2027', label: '2027 Campaign', start: '2025-01-01', end: '2027-12-31' },
    { value: '2022', label: '2022 Election', start: '2021-01-01', end: '2022-12-31' },
    { value: '2017', label: '2017 Election', start: '2016-01-01', end: '2017-12-31' },
  ]

  // Load intelligence data
  useEffect(() => {
    loadIntelligence()
  }, [personId])

  const loadIntelligence = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // First check if we have cached data in Firestore
      const response = await fetch(`/api/intelligence/person/${personId}`)
      if (response.ok) {
        const data = await response.json()
        setIntelligence(data)
      } else {
        // No cached data, trigger scrape
        await triggerScrape(false)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerScrape = async (forceRefresh: boolean) => {
    setIsScraping(true)
    setError(null)
    try {
      const period = campaignPeriods.find(p => p.value === campaignPeriod)
      const response = await fetch('/api/intelligence/person/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personName: decodeURIComponent(personId.replace(/-/g, ' ')),
          personId,
          forceRefresh,
          startDate: period?.start,
          endDate: period?.end,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to scrape intelligence')
      }

      const result = await response.json()
      setIntelligence(result.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsScraping(false)
    }
  }

  const generateReport = async () => {
    setIsGeneratingReport(true)
    setError(null)
    try {
      const period = campaignPeriods.find(p => p.value === campaignPeriod)
      const response = await fetch(`/api/intelligence/person/${personId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: period?.start,
          endDate: period?.end,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate report')
      }

      // Download the report
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${personId}-campaign-finance-report-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      setError(err.message)
      alert(`Report generation failed: ${err.message}`)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const filteredActivities = intelligence?.activities.filter(activity => {
    if (activeTab === 'all') return true
    if (activeTab === 'rallies') return activity.type === 'rally'
    if (activeTab === 'financial') return activity.amountMentioned !== null
    if (activeTab === 'news') return activity.type === 'news' || activity.type === 'statement'
    return true
  }) || []

  const totalFinancial = intelligence?.financialSignals.reduce(
    (sum, signal) => sum + (signal.amountKes || 0),
    0
  ) || 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !intelligence) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-900 mb-2">Error Loading Intelligence</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => loadIntelligence()}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              {intelligence?.photoUrl && (
                <img
                  src={intelligence.photoUrl}
                  alt={intelligence.personName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {intelligence?.personName || decodeURIComponent(personId.replace(/-/g, ' '))}
                </h1>
                {intelligence?.position && (
                  <p className="text-lg text-gray-600 mb-1">{intelligence.position}</p>
                )}
                {intelligence?.party && (
                  <p className="text-sm text-gray-500">{intelligence.party} • {intelligence.county}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Campaign Period Selector */}
              <select
                value={campaignPeriod}
                onChange={(e) => setCampaignPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {campaignPeriods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => triggerScrape(true)}
                disabled={isScraping}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isScraping ? 'animate-spin' : ''}`} />
                {isScraping ? 'Scraping...' : 'Refresh Data'}
              </button>

              {intelligence && intelligence.activities.length > 0 && (
                <button
                  onClick={generateReport}
                  disabled={isGeneratingReport}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className={`w-4 h-4 ${isGeneratingReport ? 'animate-pulse' : ''}`} />
                  {isGeneratingReport ? 'Generating PDF...' : 'Download PDF Report'}
                </button>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <Newspaper className="w-4 h-4" />
                <span className="text-sm font-medium">Activities</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{intelligence?.totalActivities || 0}</p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Rallies</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{intelligence?.rallyLocations.length || 0}</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-yellow-600 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Financial Signals</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{intelligence?.financialSignals.length || 0}</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Sources</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{intelligence?.sources.length || 0}</p>
            </div>
          </div>

          {intelligence?.scrapedAt && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Last updated: {(() => {
                try {
                  const date = intelligence.scrapedAt instanceof Date 
                    ? intelligence.scrapedAt 
                    : new Date(intelligence.scrapedAt as any)
                  return isNaN(date.getTime()) 
                    ? 'Recently' 
                    : formatDistanceToNow(date, { addSuffix: true })
                } catch {
                  return 'Recently'
                }
              })()}
            </div>
          )}
        </div>

        {/* Wikipedia Summary */}
        {intelligence?.wikipediaSummary && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Profile Summary</h2>
            <p className="text-gray-700 leading-relaxed">{intelligence.wikipediaSummary}</p>
            <p className="text-sm text-gray-500 mt-2">Source: Wikipedia</p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {[
              { key: 'all', label: 'All Activities', count: intelligence?.activities.length },
              { key: 'rallies', label: 'Rallies', count: intelligence?.activities.filter(a => a.type === 'rally').length },
              { key: 'financial', label: 'Financial', count: intelligence?.financialSignals.length },
              { key: 'news', label: 'News', count: intelligence?.activities.filter(a => a.type === 'news').length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count || 0})
              </button>
            ))}
          </div>

          {/* Activity Feed */}
          <div className="space-y-4">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No activities found. Try refreshing the data.</p>
              </div>
            ) : (
              filteredActivities.map((activity, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{activity.headline}</h3>
                      <p className="text-sm text-gray-600 mb-2">{activity.summary}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {(() => {
                            try {
                              const date = activity.publishedAt instanceof Date 
                                ? activity.publishedAt 
                                : new Date(activity.publishedAt)
                              return isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleDateString()
                            } catch {
                              return 'Unknown date'
                            }
                          })()}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded">{activity.source}</span>
                        <span className={`px-2 py-1 rounded ${
                          activity.confidenceLevel === 'verified' ? 'bg-green-100 text-green-700' :
                          activity.confidenceLevel === 'reported' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {activity.confidenceLevel}
                        </span>
                        {activity.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {activity.location}
                          </span>
                        )}
                        {activity.amountMentioned && (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <DollarSign className="w-3 h-3" />
                            KSh {(activity.amountMentioned / 1000000).toFixed(1)}M
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={activity.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Export Buttons */}
          {filteredActivities.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3">
              <button 
                onClick={generateReport}
                disabled={isGeneratingReport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className={`w-4 h-4 ${isGeneratingReport ? 'animate-pulse' : ''}`} />
                {isGeneratingReport ? 'Generating PDF...' : 'Download PDF Report'}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <Download className="w-4 h-4" />
                Export as CSV
              </button>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">Campaign Finance Focus</h4>
          <p className="text-sm text-yellow-800 mb-2">
            <strong>This intelligence module focuses exclusively on campaign finance topics:</strong>
          </p>
          <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">
            <li>Corruption and bribery allegations</li>
            <li>Party funding (PPF allocations, donations)</li>
            <li>Campaign spending and financial disclosures</li>
            <li>Spending limit violations</li>
            <li>Illegal donations (foreign, anonymous, corporate)</li>
            <li>Misuse of public resources for campaigns</li>
            <li>Vote buying incidents</li>
          </ul>
          <p className="text-sm text-yellow-800 mt-2">
            Data is collected from public records, news media, social media platforms (TikTok, Instagram, Twitter/X, YouTube), 
            and official government sources. General political news and non-financial activities are excluded. 
            For corrections: intelligence@fedhawatch.org
          </p>
        </div>
      </div>
    </div>
  )
}
