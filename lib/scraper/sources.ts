import * as cheerio from 'cheerio'
import { ActivityItem } from '@/lib/types/intelligence'
import { 
  extractKesAmount, 
  classifyActivityType, 
  extractKenyaLocation,
  parseScrapedDate,
  sanitizeText,
  delay 
} from './utils'

const USER_AGENT = 'FedhaWatch/1.0 (TI-Kenya civic accountability tool; +https://fedhawatch.org)'

/**
 * Scrape Nation Africa
 */
export async function scrapeNationAfrica(searchTerm: string): Promise<ActivityItem[]> {
  try {
    const url = `https://nation.africa/kenya/search?q=${encodeURIComponent(searchTerm)}+rally+campaign`
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 21600 } // 6 hours cache
    })
    
    if (!res.ok) return []
    
    const html = await res.text()
    const $ = cheerio.load(html)
    const items: ActivityItem[] = []

    $('.search-result, .article-card, [data-type="article"]').each((_, el) => {
      const headline = $(el).find('h2, h3, .headline').text().trim()
      const summary = $(el).find('p, .summary, .excerpt').first().text().trim()
      const relativeUrl = $(el).find('a').attr('href')
      const dateText = $(el).find('time, .date, [datetime]').attr('datetime')
        ?? $(el).find('time, .date').text().trim()

      if (headline && relativeUrl) {
        const fullText = headline + ' ' + summary
        items.push({
          source: 'Nation Media',
          headline: sanitizeText(headline, 200),
          summary: sanitizeText(summary, 300),
          sourceUrl: relativeUrl.startsWith('http') ? relativeUrl : `https://nation.africa${relativeUrl}`,
          publishedAt: dateText ? parseScrapedDate(dateText) : new Date(),
          type: classifyActivityType(fullText) as any,
          confidenceLevel: 'reported',
          rawText: fullText,
          location: extractKenyaLocation(fullText),
          locationLat: null,
          locationLng: null,
          amountMentioned: extractKesAmount(fullText),
        })
      }
    })

    await delay(2000) // Respect rate limits
    return items.slice(0, 10) // Limit results
  } catch (error) {
    console.error('Nation Africa scrape error:', error)
    return []
  }
}

/**
 * Scrape Standard Media
 */
export async function scrapeStandardMedia(searchTerm: string): Promise<ActivityItem[]> {
  try {
    const url = `https://www.standardmedia.co.ke/search/${encodeURIComponent(searchTerm)}`
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 21600 }
    })
    
    if (!res.ok) return []
    
    const html = await res.text()
    const $ = cheerio.load(html)
    const items: ActivityItem[] = []

    $('.article, .story-item, .search-item').each((_, el) => {
      const headline = $(el).find('h2, h3, .title').text().trim()
      const summary = $(el).find('p, .description').first().text().trim()
      const relativeUrl = $(el).find('a').attr('href')
      const dateText = $(el).find('time, .date').text().trim()

      if (headline && relativeUrl) {
        const fullText = headline + ' ' + summary
        items.push({
          source: 'Standard Media',
          headline: sanitizeText(headline, 200),
          summary: sanitizeText(summary, 300),
          sourceUrl: relativeUrl.startsWith('http') ? relativeUrl : `https://www.standardmedia.co.ke${relativeUrl}`,
          publishedAt: dateText ? parseScrapedDate(dateText) : new Date(),
          type: classifyActivityType(fullText) as any,
          confidenceLevel: 'reported',
          rawText: fullText,
          location: extractKenyaLocation(fullText),
          locationLat: null,
          locationLng: null,
          amountMentioned: extractKesAmount(fullText),
        })
      }
    })

    await delay(2000)
    return items.slice(0, 10)
  } catch (error) {
    console.error('Standard Media scrape error:', error)
    return []
  }
}

/**
 * Scrape Wikipedia using official API
 */
export async function scrapeWikipedia(searchTerm: string): Promise<ActivityItem[]> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm.replace(' ', '_'))}`
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 604800 } // 7 days cache
    })
    
    if (!res.ok) return []
    
    const data = await res.json()

    return [{
      source: 'Wikipedia',
      headline: data.title || searchTerm,
      summary: sanitizeText(data.extract || '', 500),
      sourceUrl: data.content_urls?.desktop?.page || '',
      publishedAt: new Date(),
      type: 'profile',
      confidenceLevel: 'reported',
      rawText: data.extract || '',
      photo: data.thumbnail?.source || null,
      location: null,
      locationLat: null,
      locationLng: null,
      amountMentioned: null,
    }]
  } catch (error) {
    console.error('Wikipedia scrape error:', error)
    return []
  }
}

/**
 * Scrape Meta Ad Library using public API
 */
export async function scrapeMetaAdLibrary(searchTerm: string): Promise<ActivityItem[]> {
  try {
    // Note: Meta Ad Library requires access token in production
    // This is a simplified version
    const url = `https://www.facebook.com/ads/library/api/?search_terms=${encodeURIComponent(searchTerm)}&ad_type=POLITICAL_AND_ISSUE_ADS&country=KE&limit=20`
    
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 21600 }
    })
    
    if (!res.ok) return []
    
    const data = await res.json()
    
    return (data.data || []).map((ad: any) => ({
      source: 'Meta Ad Library',
      headline: `Facebook/Instagram Ad: ${ad.page_name || 'Political Advertisement'}`,
      summary: sanitizeText(ad.ad_creative_body || 'Political advertisement', 300),
      sourceUrl: `https://www.facebook.com/ads/library/?id=${ad.id}`,
      publishedAt: ad.ad_delivery_start_time ? new Date(ad.ad_delivery_start_time) : new Date(),
      type: 'ad-spend',
      confidenceLevel: 'verified',
      rawText: ad.ad_creative_body || '',
      location: null,
      locationLat: null,
      locationLng: null,
      amountMentioned: null,
    }))
  } catch (error) {
    console.error('Meta Ad Library scrape error:', error)
    return []
  }
}

/**
 * Scrape Parliament of Kenya
 */
export async function scrapeParliamentKe(searchTerm: string): Promise<ActivityItem[]> {
  try {
    const url = `https://parliament.go.ke/search?q=${encodeURIComponent(searchTerm)}`
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      next: { revalidate: 86400 } // 24 hours cache
    })
    
    if (!res.ok) return []
    
    const html = await res.text()
    const $ = cheerio.load(html)
    const items: ActivityItem[] = []

    $('.member, .mp-card, .search-result').each((_, el) => {
      const name = $(el).find('.name, h3, h4').text().trim()
      const position = $(el).find('.position, .constituency').text().trim()
      const profileUrl = $(el).find('a').attr('href')

      if (name && name.toLowerCase().includes(searchTerm.toLowerCase())) {
        items.push({
          source: 'Parliament of Kenya',
          headline: `${name} - ${position}`,
          summary: `Member of Parliament: ${position}`,
          sourceUrl: profileUrl?.startsWith('http') ? profileUrl : `https://parliament.go.ke${profileUrl}`,
          publishedAt: new Date(),
          type: 'profile',
          confidenceLevel: 'verified',
          rawText: `${name} ${position}`,
          location: extractKenyaLocation(position),
          locationLat: null,
          locationLng: null,
          amountMentioned: null,
        })
      }
    })

    await delay(2000)
    return items.slice(0, 5)
  } catch (error) {
    console.error('Parliament scrape error:', error)
    return []
  }
}

/**
 * Scrape YouTube (using search results page, not API)
 */
export async function scrapeYouTube(searchTerm: string): Promise<ActivityItem[]> {
  try {
    // Note: YouTube scraping is limited without API key
    // This is a placeholder for the structure
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}+rally+kenya+2027`
    
    // In production, use YouTube Data API v3
    // For now, return empty array
    return []
  } catch (error) {
    console.error('YouTube scrape error:', error)
    return []
  }
}
