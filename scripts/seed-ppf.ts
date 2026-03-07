import { adminDb } from '../lib/firebase/admin'

// Sample PPF allocations for 2023/24 financial year
// Source: ORPP Annual Reports (these are example values - replace with actual data)
const PPF_ALLOCATIONS = [
  {
    partyId: '', // Will be filled after parties are seeded
    partyName: 'Orange Democratic Movement',
    year: '2023/24',
    amountKes: 256600000, // KSh 256.6M
    sourceUrl: 'https://www.orpp.or.ke/reports/ppf-2023-24.pdf'
  },
  {
    partyId: '',
    partyName: 'United Democratic Alliance',
    year: '2023/24',
    amountKes: 312400000, // KSh 312.4M
    sourceUrl: 'https://www.orpp.or.ke/reports/ppf-2023-24.pdf'
  },
  {
    partyId: '',
    partyName: 'Jubilee Party',
    year: '2023/24',
    amountKes: 189200000, // KSh 189.2M
    sourceUrl: 'https://www.orpp.or.ke/reports/ppf-2023-24.pdf'
  },
  {
    partyId: '',
    partyName: 'Wiper Democratic Movement',
    year: '2023/24',
    amountKes: 98500000, // KSh 98.5M
    sourceUrl: 'https://www.orpp.or.ke/reports/ppf-2023-24.pdf'
  },
  {
    partyId: '',
    partyName: 'Amani National Congress',
    year: '2023/24',
    amountKes: 67300000, // KSh 67.3M
    sourceUrl: 'https://www.orpp.or.ke/reports/ppf-2023-24.pdf'
  },
]

async function seedPPF() {
  console.log('🌱 Seeding PPF allocations...\n')
  
  try {
    // First, get party IDs from Firestore
    const partiesSnap = await adminDb.collection('parties').get()
    const partyMap = new Map<string, string>()
    
    partiesSnap.docs.forEach(doc => {
      const data = doc.data()
      partyMap.set(data.name, doc.id)
    })
    
    console.log(`📋 Found ${partyMap.size} parties in database\n`)
    
    for (const allocation of PPF_ALLOCATIONS) {
      const partyId = partyMap.get(allocation.partyName)
      
      if (!partyId) {
        console.log(`⚠️  Skipping ${allocation.partyName} - party not found in database`)
        continue
      }
      
      const ref = await adminDb.collection('ppfAllocations').add({
        ...allocation,
        partyId,
        parsedAt: new Date(),
      })
      
      console.log(`✅ Added: ${allocation.partyName} - KSh ${(allocation.amountKes / 1000000).toFixed(1)}M - ID: ${ref.id}`)
    }
    
    console.log(`\n✨ Successfully seeded PPF allocations!`)
    console.log(`\n💡 Note: These are example values. Update with actual ORPP data.`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding PPF allocations:', error)
    process.exit(1)
  }
}

seedPPF()
