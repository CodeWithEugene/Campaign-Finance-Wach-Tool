import { adminDb } from '../lib/firebase/admin'

const PARTIES = [
  { 
    name: 'Orange Democratic Movement', 
    abbreviation: 'ODM', 
    registeredDate: new Date('2005-01-01'),
    status: 'active' as const,
    logoUrl: ''
  },
  { 
    name: 'United Democratic Alliance', 
    abbreviation: 'UDA', 
    registeredDate: new Date('2020-01-01'),
    status: 'active' as const,
    logoUrl: ''
  },
  { 
    name: 'Azimio la Umoja - One Kenya Coalition', 
    abbreviation: 'AZIMIO', 
    registeredDate: new Date('2021-01-01'),
    status: 'active' as const,
    logoUrl: ''
  },
  { 
    name: 'Wiper Democratic Movement', 
    abbreviation: 'WDM', 
    registeredDate: new Date('2007-01-01'),
    status: 'active' as const,
    logoUrl: ''
  },
  { 
    name: 'Amani National Congress', 
    abbreviation: 'ANC', 
    registeredDate: new Date('2015-01-01'),
    status: 'active' as const,
    logoUrl: ''
  },
  { 
    name: 'FORD Kenya', 
    abbreviation: 'FORD-K', 
    registeredDate: new Date('1992-01-01'),
    status: 'active' as const,
    logoUrl: ''
  },
  { 
    name: 'Jubilee Party', 
    abbreviation: 'JP', 
    registeredDate: new Date('2016-09-08'),
    status: 'active' as const,
    logoUrl: ''
  },
  { 
    name: 'Kenya National Congress', 
    abbreviation: 'KNC', 
    registeredDate: new Date('2012-01-01'),
    status: 'active' as const,
    logoUrl: ''
  },
  { 
    name: 'Party of National Unity', 
    abbreviation: 'PNU', 
    registeredDate: new Date('2007-01-01'),
    status: 'active' as const,
    logoUrl: ''
  },
  { 
    name: 'United Party of Independent Alliance', 
    abbreviation: 'UPIA', 
    registeredDate: new Date('2016-01-01'),
    status: 'active' as const,
    logoUrl: ''
  },
]

async function seedParties() {
  console.log('🌱 Seeding political parties...\n')
  
  try {
    for (const party of PARTIES) {
      const ref = await adminDb.collection('parties').add({
        ...party,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log(`✅ Added: ${party.name} (${party.abbreviation}) - ID: ${ref.id}`)
    }
    
    console.log(`\n✨ Successfully seeded ${PARTIES.length} parties!`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding parties:', error)
    process.exit(1)
  }
}

seedParties()
