import { KENYA_COUNTIES } from '@/lib/utils/kenya-data'

/**
 * Extract KES amounts from text
 * Matches patterns like: KSh 4.4 billion, KES 250,000, Ksh 2.5M, 50 million shillings
 */
export function extractKesAmount(text: string): number | null {
  const patterns = [
    /KSh\s*([\d,.]+)\s*(billion|million|thousand)?/gi,
    /KES\s*([\d,.]+)\s*(billion|million|thousand)?/gi,
    /Ksh\s*([\d,.]+)\s*(billion|million|thousand)?/gi,
    /([\d,.]+)\s*(billion|million|thousand)?\s*shillings/gi,
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      const numStr = match[0].replace(/[^0-9.]/g, '')
      const num = parseFloat(numStr)
      const lower = match[0].toLowerCase()
      if (lower.includes('billion')) return num * 1_000_000_000
      if (lower.includes('million')) return num * 1_000_000
      if (lower.includes('thousand')) return num * 1_000
      return num
    }
  }
  return null
}

/**
 * Classify activity type from text content
 */
export function classifyActivityType(text: string): string {
  const lower = text.toLowerCase()
  if (lower.includes('rally') || lower.includes('meeting') || lower.includes('baraza'))
    return 'rally'
  if (lower.includes('donat') || lower.includes('contribut') || lower.includes('fund'))
    return 'donation-received'
  if (lower.includes('advert') || lower.includes('campaign ad') || lower.includes('sponsored'))
    return 'ad-spend'
  if (lower.includes('government vehicle') || lower.includes('public resources') || lower.includes('state'))
    return 'public-resource-misuse'
  if (lower.includes('statement') || lower.includes('said') || lower.includes('announced'))
    return 'statement'
  return 'news'
}

/**
 * Extract Kenya location names from text
 */
export function extractKenyaLocation(text: string): string | null {
  const KENYA_LOCATIONS = [
    ...KENYA_COUNTIES,
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
    'Kitale', 'Malindi', 'Garissa', 'Kakamega', 'Nyeri', 'Machakos',
    'Meru', 'Lamu', 'Isiolo', 'Marsabit', 'Turkana', 'Mandera',
    'Wajir', 'Kwale', 'Kilifi', 'Tana River', 'Taita Taveta',
    'Kajiado', 'Makueni', 'Nyandarua', 'Murang\'a', 'Kirinyaga',
    'Kiambu', 'West Pokot', 'Samburu', 'Trans Nzoia',
    'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo', 'Laikipia',
    'Narok', 'Kericho', 'Bomet', 'Vihiga',
    'Bungoma', 'Busia', 'Siaya', 'Homa Bay', 'Migori',
    'Kisii', 'Nyamira'
  ]

  for (const location of KENYA_LOCATIONS) {
    if (text.includes(location)) return location
  }
  return null
}

/**
 * Parse date from various formats found in scraped content
 */
export function parseScrapedDate(dateText: string): Date {
  try {
    // Try ISO format first
    const isoDate = new Date(dateText)
    if (!isNaN(isoDate.getTime())) return isoDate

    // Try common formats
    const formats = [
      /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i,
      /(\d{4})-(\d{2})-(\d{2})/,
    ]

    for (const format of formats) {
      const match = dateText.match(format)
      if (match) {
        return new Date(dateText)
      }
    }
  } catch (e) {
    // Fallback to current date
  }
  return new Date()
}

/**
 * Sanitize and truncate text
 */
export function sanitizeText(text: string, maxLength: number = 500): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s.,!?-]/g, '')
    .trim()
    .slice(0, maxLength)
}

/**
 * Check if URL is allowed by robots.txt (simplified check)
 */
export function isAllowedByRobots(url: string): boolean {
  // In production, implement proper robots.txt checking
  // For now, allow all major news sites
  const allowedDomains = [
    'nation.africa',
    'standardmedia.co.ke',
    'the-star.co.ke',
    'citizen.digital',
    'theelephant.info',
    'businessdailyafrica.com',
    'parliament.go.ke',
    'iebc.or.ke',
    'wikipedia.org',
    'facebook.com'
  ]
  
  return allowedDomains.some(domain => url.includes(domain))
}

/**
 * Add delay between requests to respect rate limits
 */
export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate cache key for scrape results
 */
export function generateCacheKey(type: 'person' | 'party', id: string): string {
  return `${type}_${id}_${new Date().toISOString().split('T')[0]}`
}
