export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos',
  'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a',
  'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
  'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi', 'Trans Nzoia',
  'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
] as const

export const ALAC_OFFICES = [
  {
    name: 'Nairobi ALAC',
    region: 'Nairobi & Central',
    address: 'ACK Garden House, 1st Ngong Avenue',
    phone: '+254 20 2727763',
    email: 'info@tikenya.org',
    lat: -1.2864,
    lng: 36.8172
  },
  {
    name: 'Mombasa ALAC',
    region: 'Coast',
    address: 'Mombasa Office',
    phone: '+254 41 2230181',
    email: 'coast@tikenya.org',
    lat: -4.0435,
    lng: 39.6682
  },
  {
    name: 'Eldoret ALAC',
    region: 'Rift Valley',
    address: 'Eldoret Office',
    phone: '+254 53 2063170',
    email: 'riftvalley@tikenya.org',
    lat: 0.5143,
    lng: 35.2698
  },
  {
    name: 'Kisumu ALAC',
    region: 'Western & Nyanza',
    address: 'Kisumu Office',
    phone: '+254 57 2023868',
    email: 'western@tikenya.org',
    lat: -0.0917,
    lng: 34.7680
  }
]

export const REPORT_CATEGORIES = {
  'vote-buying': {
    label: 'Vote Buying',
    subcategories: ['Cash', 'Food', 'Goods', 'Transport'],
    color: '#EF4444'
  },
  'illegal-donations': {
    label: 'Alleged Illegal Donations',
    subcategories: ['Foreign source', 'Anonymous above threshold', 'Corporate prohibited'],
    color: '#F97316'
  },
  'public-resource-misuse': {
    label: 'Alleged Misuse of Public Resources',
    subcategories: ['Vehicles', 'Buildings', 'Personnel', 'State media'],
    color: '#3B82F6'
  },
  'undeclared-spending': {
    label: 'Undeclared Spending',
    subcategories: [],
    color: '#EAB308'
  },
  'bribery': {
    label: 'Alleged Bribery of Officials',
    subcategories: [],
    color: '#8B5CF6'
  },
  'other': {
    label: 'Other',
    subcategories: [],
    color: '#6B7280'
  }
} as const
