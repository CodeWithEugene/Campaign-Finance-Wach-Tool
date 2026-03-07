/**
 * Prefilled intelligence data for Kenyan parties and politicians.
 * Photos use Wikimedia Commons / Wikipedia where possible (public domain or freely licensed).
 */

export type ActivityCategory = 'rally' | 'financial' | 'news' | 'other';

export interface IntelligenceActivity {
  title: string;
  description: string;
  date: string;
  category: ActivityCategory;
  tags: string[];
  location: string;
  amount?: string;
  sourceUrl?: string;
}

export interface IntelligenceEntity {
  id: string;
  name: string;
  type: 'party' | 'politician';
  /** Main photo URL (e.g. from Wikimedia Commons) */
  imageUrl: string;
  /** Short bio or party description */
  bio?: string;
  /** Alternative names for search matching */
  searchTerms: string[];
  /** Activities keyed by campaign period (2017, 2022, 2027) */
  activitiesByPeriod: Record<string, IntelligenceActivity[]>;
}

/** Wikimedia Commons redirect URL for a filename (use underscores, no "File:" prefix) */
function commonsImage(filename: string): string {
  return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${filename}`;
}

/** Wikipedia main page image (often the infobox image for the article) */
function wikiImage(pageTitle: string): string {
  return `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`;
}

const PARTIES: IntelligenceEntity[] = [
  {
    id: 'odm',
    name: 'ODM',
    type: 'party',
    imageUrl: wikiImage('Orange_Democratic_Movement'),
    bio: 'Orange Democratic Movement. One of the major political parties in Kenya.',
    searchTerms: ['ODM', 'Orange Democratic Movement', 'Orange Democratic'],
    activitiesByPeriod: {
      '2017': [
        {
          title: 'ODM PPF allocation and campaign spending (2017)',
          description: 'ODM received Political Parties Fund allocations and reported campaign expenditure during the 2017 general election cycle. The party contested numerous seats across the country.',
          date: '2017-08-01',
          category: 'financial',
          tags: ['Public Records', 'PPF', 'funding'],
          location: 'Nairobi',
          amount: 'KSh 184.7M',
          sourceUrl: 'https://orpp.or.ke/document/political-parties-fund-ppf-distribution-2023/',
        },
        {
          title: 'Coalition building and campaign activities',
          description: 'ODM participated in NASA coalition activities and campaign rallies ahead of the August 2017 polls.',
          date: '2017-06-01',
          category: 'rally',
          tags: ['coalition', 'campaign'],
          location: 'Various counties, Kenya',
          sourceUrl: 'https://www.iebc.or.ke/index.php/election-results',
        },
      ],
      '2022': [
        {
          title: 'ODM PPF funding and Azimio coalition',
          description: 'ODM as part of Azimio La Umoja received PPF disbursements. Questions raised over funding for coalition campaign activities and party operations.',
          date: '2022-07-01',
          category: 'financial',
          tags: ['PPF', 'Azimio', 'reported'],
          location: 'Nairobi',
          amount: 'KSh 184.7M',
          sourceUrl: 'https://www.oagkenya.go.ke/political-parties-audit-reports/',
        },
        {
          title: 'Campaign rallies and voter outreach',
          description: 'ODM conducted rallies and voter registration drives across its stronghold regions during the 2022 campaign period.',
          date: '2022-05-01',
          category: 'rally',
          tags: ['campaign', 'rallies'],
          location: 'Nyanza, Coast, Kenya',
          sourceUrl: 'https://www.iebc.or.ke/',
        },
      ],
      '2027': [
        {
          title: 'ODM positioning and party funding transparency',
          description: 'ODM continues to receive PPF allocations. Party leadership has emphasized transparency in use of funds and preparation for the next election cycle.',
          date: '2024-01-01',
          category: 'financial',
          tags: ['PPF', 'transparency'],
          location: 'Nairobi',
          sourceUrl: 'https://orpp.or.ke/administration-of-the-political-parties-fund/',
        },
      ],
    },
  },
  {
    id: 'uda',
    name: 'UDA',
    type: 'party',
    imageUrl: wikiImage('United_Democratic_Alliance_(Kenya)'),
    bio: 'United Democratic Alliance. Formed ahead of the 2022 general election.',
    searchTerms: ['UDA', 'United Democratic Alliance'],
    activitiesByPeriod: {
      '2022': [
        {
          title: 'Questions raised over sources of funds for hustler movement and harambee donations',
          description: 'DP Ruto\'s harambee donations and funding for the "hustler movement" and UDA campaigns drew scrutiny from oversight bodies and civil society over sources of funds.',
          date: '2021-08-01',
          category: 'financial',
          tags: ['Public Records', 'reported', 'donations'],
          location: 'Various counties, Kenya',
          sourceUrl: 'https://tikenya.org/',
        },
        {
          title: 'Questions raised over funding for UDA party headquarters in Nairobi',
          description: 'Funding for UDA\'s lavish party headquarters in Nairobi attracted media and public interest regarding compliance with campaign finance rules.',
          date: '2022-01-01',
          category: 'financial',
          tags: ['funding', 'reported'],
          location: 'Nairobi',
          amount: 'KSh 300.0M',
          sourceUrl: 'https://www.standardmedia.co.ke',
        },
        {
          title: 'UDA campaigns and vote-buying allegations',
          description: 'UDA campaigns were plagued by vote-buying allegations through cash handouts and goods distribution in several counties.',
          date: '2022-06-01',
          category: 'news',
          tags: ['vote-buying', 'reported'],
          location: 'Across Kenya',
          sourceUrl: 'https://campaignwatch.tikenya.org/',
        },
      ],
      '2027': [
        {
          title: 'UDA PPF allocation and party operations',
          description: 'UDA receives Political Parties Fund allocations as a registered party. Audits and transparency reports track use of public funding.',
          date: '2024-06-01',
          category: 'financial',
          tags: ['PPF', 'Public Records'],
          location: 'Nairobi',
          amount: 'KSh 345.8M',
          sourceUrl: 'https://orpp.or.ke/document/political-parties-fund-ppf-distribution-2023/',
        },
      ],
    },
  },
  {
    id: 'jubilee',
    name: 'Jubilee Party',
    type: 'party',
    imageUrl: wikiImage('Jubilee_Party'),
    bio: 'Jubilee Party. Ruling party from 2013 until post-2022 realignments.',
    searchTerms: ['Jubilee', 'Jubilee Party', 'JP'],
    activitiesByPeriod: {
      '2017': [
        {
          title: 'Jubilee PPF and state resources during 2017 campaigns',
          description: 'Jubilee as the ruling party received significant PPF allocation. Allegations of use of state resources for campaign advantage were reported by observers.',
          date: '2017-07-01',
          category: 'financial',
          tags: ['PPF', 'reported', 'state resources'],
          location: 'Nairobi',
          amount: 'KSh 81.0M',
          sourceUrl: 'https://orpp.or.ke/administration-of-the-political-parties-fund/',
        },
      ],
      '2022': [
        {
          title: 'Jubilee split and funding disputes',
          description: 'Internal splits within Jubilee led to disputes over party funds and assets. OAG and registrar reports highlighted governance issues.',
          date: '2022-03-01',
          category: 'financial',
          tags: ['governance', 'reported'],
          location: 'Nairobi',
          sourceUrl: 'https://www.oagkenya.go.ke/political-parties-audit-reports/',
        },
      ],
    },
  },
  {
    id: 'azimio',
    name: 'Azimio La Umoja',
    type: 'party',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Kenya.svg/200px-Flag_of_Kenya.svg.png',
    bio: 'Azimio La Umoja One Kenya Coalition. Coalition formed for the 2022 general election.',
    searchTerms: ['Azimio', 'Azimio La Umoja', 'Azimio coalition'],
    activitiesByPeriod: {
      '2022': [
        {
          title: 'Azimio coalition funding and campaign spending',
          description: 'The Azimio coalition brought together multiple parties. Reporting on combined campaign spending and donor transparency was limited during the campaign.',
          date: '2022-06-01',
          category: 'financial',
          tags: ['coalition', 'funding'],
          location: 'Nairobi',
          sourceUrl: 'https://www.oagkenya.go.ke/public-funded-political-parties/',
        },
        {
          title: 'Coalition rallies and campaign activities',
          description: 'Azimio held major rallies across the country in the run-up to the August 2022 election.',
          date: '2022-07-01',
          category: 'rally',
          tags: ['campaign', 'rallies'],
          location: 'Various counties, Kenya',
          sourceUrl: 'https://www.iebc.or.ke/index.php/election-results',
        },
      ],
    },
  },
  {
    id: 'wiper',
    name: 'Wiper',
    type: 'party',
    imageUrl: wikiImage('Wiper_Democratic_Movement'),
    bio: 'Wiper Democratic Movement – Kenya. Member of Azimio in 2022.',
    searchTerms: ['Wiper', 'Wiper Democratic Movement', 'WDM-K'],
    activitiesByPeriod: {
      '2022': [
        {
          title: 'Wiper PPF and coalition participation',
          description: 'Wiper received PPF allocations and participated in Azimio coalition campaign activities.',
          date: '2022-05-01',
          category: 'financial',
          tags: ['PPF', 'Azimio'],
          location: 'Nairobi',
          sourceUrl: 'https://orpp.or.ke/document/political-parties-fund-ppf-distribution-2023/',
        },
      ],
    },
  },
];

const POLITICIANS: IntelligenceEntity[] = [
  {
    id: 'raila-odinga',
    name: 'Raila Odinga',
    type: 'politician',
    imageUrl: wikiImage('Raila_Odinga'),
    bio: 'Former Prime Minister and ODM leader. Presidential candidate in multiple elections.',
    searchTerms: ['Raila Odinga', 'Raila', 'Odinga'],
    activitiesByPeriod: {
      '2017': [
        {
          title: 'NASA coalition campaign and funding',
          description: 'Raila Odinga led the NASA coalition in the 2017 election. Campaign funding and use of resources were subject to public and media scrutiny.',
          date: '2017-08-01',
          category: 'financial',
          tags: ['NASA', 'coalition', 'reported'],
          location: 'Various counties, Kenya',
          sourceUrl: 'https://www.iebc.or.ke/',
        },
      ],
      '2022': [
        {
          title: 'Azimio presidential campaign spending',
          description: 'Raila Odinga as Azimio presidential candidate led a major campaign. Questions over sources of campaign funds and transparency were raised by observers.',
          date: '2022-07-01',
          category: 'financial',
          tags: ['Azimio', 'campaign', 'reported'],
          location: 'Across Kenya',
          sourceUrl: 'https://www.iebc.or.ke/index.php/election-results',
        },
        {
          title: 'Campaign rallies and public appearances',
          description: 'Raila held numerous rallies and public engagements during the 2022 campaign period.',
          date: '2022-06-01',
          category: 'rally',
          tags: ['campaign', 'rallies'],
          location: 'Nairobi, Kisumu, Mombasa',
          sourceUrl: 'https://www.iebc.or.ke/',
        },
      ],
    },
  },
  {
    id: 'william-ruto',
    name: 'William Ruto',
    type: 'politician',
    imageUrl: wikiImage('William_Ruto'),
    bio: 'President of Kenya (from 2022). Former DP and UDA leader.',
    searchTerms: ['William Ruto', 'Ruto', 'President Ruto'],
    activitiesByPeriod: {
      '2017': [
        {
          title: 'Jubilee campaign and harambee donations',
          description: 'As Deputy President, William Ruto was active in Jubilee campaigns. His harambee donations and fundraising activities attracted media coverage.',
          date: '2017-05-01',
          category: 'financial',
          tags: ['Jubilee', 'harambee', 'reported'],
          location: 'Various counties, Kenya',
          sourceUrl: 'https://www.standardmedia.co.ke',
        },
      ],
      '2022': [
        {
          title: 'Questions raised over sources of funds for hustler movement and harambee donations by DP Ruto',
          description: 'Questions were raised over the sources of funds for the "hustler movement" and harambee donations by DP Ruto during the pre-2022 campaign period.',
          date: '2021-08-01',
          category: 'financial',
          tags: ['Public Records', 'reported'],
          location: 'Various counties, Kenya',
          sourceUrl: 'https://tikenya.org/',
        },
        {
          title: 'Weston Hotel land ownership dispute resurfaces as integrity criticism',
          description: 'Weston Hotel land ownership dispute resurfaces as a point of integrity criticism against DP Ruto, with allegations of irregular acquisition.',
          date: '2021-03-01',
          category: 'news',
          tags: ['reported', 'integrity'],
          location: 'Nairobi',
          amount: 'KSh 300.0M',
          sourceUrl: 'https://www.nation.co.ke',
        },
        {
          title: 'DP Ruto accused of using state vehicles and resources for early campaigns',
          description: 'DP Ruto was accused of using state vehicles and resources for early campaign activities, raising concerns over misuse of public resources.',
          date: '2021-01-01',
          category: 'news',
          tags: ['reported', 'state resources'],
          location: 'Across Kenya',
          sourceUrl: 'https://campaignwatch.tikenya.org/',
        },
        {
          title: 'UDA campaigns and vote-buying allegations',
          description: 'UDA campaigns led by Ruto were plagued by vote-buying allegations through cash handouts and goods distribution.',
          date: '2022-06-01',
          category: 'news',
          tags: ['vote-buying', 'reported'],
          location: 'Across Kenya',
          sourceUrl: 'https://campaignwatch.tikenya.org/',
        },
      ],
    },
  },
  {
    id: 'rigathi-gachagua',
    name: 'Rigathi Gachagua',
    type: 'politician',
    imageUrl: wikiImage('Rigathi_Gachagua'),
    bio: 'Deputy President of Kenya (from 2022). UDA.',
    searchTerms: ['Rigathi Gachagua', 'Gachagua', 'Rigathi'],
    activitiesByPeriod: {
      '2022': [
        {
          title: 'Court orders forfeiture of Gachagua funds in corruption case',
          description: 'A court ordered the forfeiture of millions of shillings linked to Rigathi Gachagua in a corruption and money-laundering case. The matter drew attention to campaign-era financial disclosures.',
          date: '2022-07-28',
          category: 'financial',
          tags: ['Public Records', 'reported', 'court'],
          location: 'Nairobi',
          amount: 'KSh 202M',
          sourceUrl: 'https://www.standardmedia.co.ke',
        },
        {
          title: 'Campaign role and UDA activities',
          description: 'Rigathi Gachagua was a key figure in UDA campaign activities and fundraising in the run-up to the 2022 election.',
          date: '2022-05-01',
          category: 'rally',
          tags: ['UDA', 'campaign'],
          location: 'Central Kenya',
        },
      ],
    },
  },
  {
    id: 'kalia-musalia',
    name: 'Musalia Mudavadi',
    type: 'politician',
    imageUrl: wikiImage('Musalia_Mudavadi'),
    bio: 'Prime Cabinet Secretary. ANC leader, was in Kenya Kwanza for 2022.',
    searchTerms: ['Musalia Mudavadi', 'Mudavadi', 'Musalia'],
    activitiesByPeriod: {
      '2022': [
        {
          title: 'ANC and Kenya Kwanza coalition funding',
          description: 'Musalia Mudavadi led ANC into the Kenya Kwanza coalition. Party and coalition funding sources were subject to public interest.',
          date: '2022-06-01',
          category: 'financial',
          tags: ['ANC', 'Kenya Kwanza', 'coalition'],
          location: 'Nairobi',
          sourceUrl: 'https://www.oagkenya.go.ke/public-funded-political-parties/',
        },
      ],
    },
  },
];

const ALL_ENTITIES: IntelligenceEntity[] = [...PARTIES, ...POLITICIANS];

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Find a prefilled entity by search query and type */
export function findIntelligenceEntity(
  query: string,
  type: 'party' | 'politician'
): IntelligenceEntity | null {
  const normalized = normalizeQuery(query);
  if (!normalized) return null;
  const list = type === 'party' ? PARTIES : POLITICIANS;
  return (
    list.find(
      (e) =>
        e.name.toLowerCase() === normalized ||
        e.searchTerms.some((t) => t.toLowerCase() === normalized || t.toLowerCase().includes(normalized)) ||
        normalized.includes(e.name.toLowerCase())
    ) ?? null
  );
}

/** Get activities for an entity filtered by campaign period */
export function getActivitiesForPeriod(
  entity: IntelligenceEntity,
  period: string
): IntelligenceActivity[] {
  const activities = entity.activitiesByPeriod[period];
  return Array.isArray(activities) ? activities : [];
}

/** All prefilled entities (for listing/autocomplete) */
export function getAllIntelligenceEntities(): IntelligenceEntity[] {
  return ALL_ENTITIES;
}
