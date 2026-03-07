/**
 * Knowledge base for the Campaign Finance Watch Tool chatbot.
 * Used to answer questions about the project, hackathon, features, and context.
 */

export type KnowledgeEntry = {
  /** Keywords that trigger this answer (lowercase, one word or short phrase). */
  keywords: string[];
  /** Answer text. Use **bold** for emphasis. */
  answer: string;
};

export const CHATBOT_KNOWLEDGE: KnowledgeEntry[] = [
  // —— Hackathon & organisers ——
  {
    keywords: [
      'hackathon',
      'ti-kenya',
      'transparency international',
      'ilab',
      'ilabafrica',
      'strathmore',
      'who built',
      'who made',
      'who created',
      'who runs',
      'organizer',
      'organised',
      'organized',
      'sponsor',
      'partner',
      'elgia',
      'urai',
      'cmd',
      'fcdo',
      'kisp',
      'acknowledgment',
      'acknowledgement',
    ],
    answer:
      "This platform was built for the **TI-Kenya Campaign Finance Watch Tool Hackathon**. **Transparency International Kenya (TI-Kenya)** leads the mission. The hackathon was organised by **@iLabAfrica** at **Strathmore University** (see [ilabafrica.strathmore.edu](https://ilabafrica.strathmore.edu/)). Support and partners include **ELGIA**, **URAI Trust**, **CMD**, and **FCDO** under **KISP**. The goal is to enhance transparency and accountability in political financing in Kenya.",
  },
  {
    keywords: [
      'what is this',
      'what is the project',
      'what is this app',
      'what is this tool',
      'what is this platform',
      'what is campaign finance watch',
      'about the project',
      'about this app',
    ],
    answer:
      "The **Campaign Finance Watch Tool** is a digital platform to **track political financing**, **visualize campaign finance data**, and **monitor misuse of public resources** in Kenya. You can learn how parties are funded, report misuse (web, SMS, USSD), contribute via Mchango, explore reports on a map, and use dashboards and exports for research. It was built for the TI-Kenya Campaign Finance Watch Tool Hackathon.",
  },
  {
    keywords: [
      'github',
      'repository',
      'repo',
      'source code',
      'open source',
      'code',
      'contribute',
      'contributing',
      'pull request',
      'pr',
      'issue',
      'license',
      'mit',
    ],
    answer:
      "The project is **open source** on GitHub. You can find the repo, report bugs, suggest features, and submit pull requests. See the **Contributing** guide in the footer or README for development setup, coding standards, and the PR process. The project is licensed under the **MIT License**.",
  },
  {
    keywords: [
      'live',
      'url',
      'website',
      'deploy',
      'vercel',
      'where is it hosted',
      'production',
    ],
    answer:
      "The app is live at **campaign-finance-wach-tool.vercel.app** and is deployed on **Vercel**. USSD callback and API base use the same production URL.",
  },

  // —— Tech stack ——
  {
    keywords: [
      'tech',
      'stack',
      'technology',
      'built with',
      'next',
      'nextjs',
      'convex',
      'nextauth',
      'paystack',
      'africa\'s talking',
      'leaflet',
      'react',
    ],
    answer:
      "**Tech stack**: **Next.js** (Vercel), **Convex** (database and backend), **NextAuth** (credentials for admin and user login), **Paystack** (Mchango payments), **Africa's Talking** (USSD and SMS), **React** and **Leaflet** (map). Multi-language uses **next-intl**; charts use **Recharts**.",
  },

  // —— Features: reporting ——
  {
    keywords: [
      'report',
      'reporting',
      'submit',
      'evidence',
      'how to report',
      'report misuse',
    ],
    answer:
      "To **report** campaign finance misuse: (1) Use **Report** in the menu and fill the form (title, category, description, location). You can add photos or video and report **anonymously**. (2) **USSD**: dial the shortcode and follow the menu (language → category → description → location → confirm). (3) See the **SMS** instructions under Report for text reporting.",
  },
  {
    keywords: ['ussd', 'shortcode', 'dial', '*384', 'feature phone'],
    answer:
      "**USSD reporting**: Dial the Campaign Finance Watch shortcode, choose language (English/Kiswahili), select a category (e.g. vote buying, misuse of public resources), enter a short description, then your county or town, and confirm. Your report is saved and reviewed. The callback is this app's /api/ussd endpoint.",
  },
  {
    keywords: ['sms', 'text message', 'shortcode sms'],
    answer:
      "You can report via **SMS** too. In the menu go to **Report** and open the **SMS instructions** page for the number and message format (e.g. REPORT [category] [description] [location]).",
  },
  {
    keywords: [
      'category',
      'categories',
      'vote buying',
      'illegal donation',
      'misuse of public resources',
      'bribery',
      'undeclared',
    ],
    answer:
      "Report **categories** include: **Vote buying**, **Illegal donations**, **Misuse of public resources**, **Undeclared spending**, **Bribery of officials**, and **Other**. You pick one when submitting a report (web, USSD, or SMS).",
  },
  {
    keywords: ['anonymous', 'anonymously', 'privacy', 'whistleblower', 'identity'],
    answer:
      "You can submit reports **anonymously** (no name, email, or phone required). The platform follows **whistleblower protection** and data minimization (e.g. no unnecessary logging). See the **Privacy** page and the feature spec for details.",
  },

  // —— Mchango ——
  {
    keywords: [
      'mchango',
      'contribute',
      'donate',
      'pay',
      'paystack',
      'm-pesa',
      'crowdfund',
      'contribution',
    ],
    answer:
      "**Mchango** lets you contribute to political parties or candidates transparently. Go to **Mchango** in the menu, choose a party, enter the amount (KES; min/max apply), and you're redirected to **Paystack** to pay with M-Pesa or card. Contributions are recorded and visible in the transparency dashboard (aggregate only, no individual amounts).",
  },

  // —— Map & dashboard ——
  {
    keywords: ['map', 'maps', 'location', 'heat map', 'marker', 'leaflet'],
    answer:
      "The **Map** page shows reports by location. You can filter by category and status, switch between markers and **heat map**, and click markers for details. Reports are placed by county when no exact coordinates are given. It's Kenya-focused and works on mobile and desktop.",
  },
  {
    keywords: ['dashboard', 'stats', 'statistics', 'charts', 'overview'],
    answer:
      "The **Dashboard** shows overview stats (total reports, this week/month, verified count), charts by category and status, top counties, and recent reports. Use it to see trends and patterns. There are also party-level dashboards and a transparency index.",
  },
  {
    keywords: ['transparency', 'transparent', 'transparency index', 'disclosure'],
    answer:
      "The **Transparency** section includes the **transparency index** and party-level data. You can see how parties report, compare contributions and compliance, and view disclosure levels. Terminology uses neutral, factual language (e.g. 'verified' / 'under review' / 'unverified').",
  },

  // —— Learn, PPF, legal ——
  {
    keywords: [
      'learn',
      'education',
      'ppf',
      'political parties fund',
      '0.3%',
      'orpp',
      'formula',
    ],
    answer:
      "The **Learn** hub explains campaign funding: the **Political Parties Fund (PPF)** — 0.3% of national revenue — the **PPF distribution formula** (5% admin, 10% elected reps, 15% SIG, 70% by votes), **ORPP** as the administering body, and links to the Political Parties Act 2011 and Constitution Article 88(4)(i). Use **Learn** in the menu and its sub-pages (e.g. formula, glossary, spending limits).",
  },
  {
    keywords: [
      'limits',
      'spending limits',
      'campaign spending',
      'election campaign financing',
      'iebc',
      '4.4 billion',
      'revoked',
    ],
    answer:
      "**Spending limits**: The Election Campaign Financing Act 2013 (No. 42 of 2013) once set limits (e.g. 2017 presidential KSh 4.4 billion). In **October 2021** the IEBC **revoked** limits after Parliament rejected regulations. **Current status**: no enforceable limits; the constitutional mandate (Article 88(4)(i)) remains. Court petitions E540/2021 and E546/2021 (Katiba Institute, TI-Kenya vs IEBC/Speaker) relate to this. The **Learn** section has a timeline and explainer.",
  },
  {
    keywords: ['glossary', 'terminology', 'ppf', 'orpp', 'iebc', 'ecf', 'sig'],
    answer:
      "Key terms: **PPF** (Political Parties Fund), **ORPP** (Office of the Registrar of Political Parties), **IEBC** (Independent Electoral and Boundaries Commission), **ECF Act** (Election Campaign Financing Act), **SIG** (Special Interest Groups). The **Learn** section has a **glossary** and plain-language explainers.",
  },
  {
    keywords: ['calculator', 'ppf calculator', 'formula calculator'],
    answer:
      "The **PPF Formula Calculator** (under **Learn** or **Calculator** in the menu) lets you estimate a party's share of the Political Parties Fund. You can enter votes, elected reps, SIG reps, and total pool, or select a party and compare. The formula: 70% by votes, 10% by elected reps, 15% by SIG, 5% admin.",
  },

  // —— Export, press, API ——
  {
    keywords: ['export', 'download', 'csv', 'pdf', 'press', 'journalist', 'research'],
    answer:
      "You can **export** reports as **CSV** from the Reports page. The **Press** page offers a **Download Press Kit** (summary, sample data, logo) for journalists and researchers. There is also an **API** for reports/parties/contributions with pagination and filters; see **API docs** in the menu.",
  },
  {
    keywords: ['api', 'developer', 'integrate', 'swagger', 'openapi'],
    answer:
      "The platform exposes a **REST API** for researchers and journalists (e.g. GET reports, parties, contributions) with pagination and filters. See **API docs** in the menu for details. API key or rate limiting may apply for heavy use.",
  },

  // —— Accessibility & UX ——
  {
    keywords: ['accessibility', 'access', 'a11y', 'screen reader', 'keyboard', 'contrast', 'dyslexia'],
    answer:
      "Use the **accessibility icon** (bottom right) to turn on high contrast, change text size, dyslexia-friendly font, highlight links, stop animations, and voice narration. The site uses semantic HTML, ARIA labels, skip links, and keyboard navigation, and is tested for screen readers.",
  },
  {
    keywords: ['language', 'translate', 'kiswahili', 'kikuyu', 'luo', 'luhya', 'locale'],
    answer:
      "The app supports **multiple Kenyan languages** (English, Kiswahili, Kikuyu, Kamba, Luhya, Luo, Kalenjin, Somali, Maasai, Meru, Turkana, Embu, Kisii, Taita, Pokot, Kuria, and more). Use the **language switcher** in the header; the locale is in the URL (e.g. /en/, /sw/).",
  },

  // —— Data & sources ——
  {
    keywords: ['data source', 'orpp', 'data liberation', 'pdf', 'parser'],
    answer:
      "**Data sources** include **ORPP** (Political Parties Fund distribution). The platform can parse ORPP PDFs to extract party allocations by year. Data sources and “last updated” info are on the **Data sources** page. IEBC and OAG are referenced where data is available.",
  },
  {
    keywords: ['county', 'counties', '47', 'constituency'],
    answer:
      "The platform supports Kenya's **47 counties** and constituencies. You can filter and view reports by county, see county-level dashboards, and compare counties. The map can show county boundaries and aggregate stats per county.",
  },
  {
    keywords: ['verified', 'verification', 'under review', 'unverified', 'triangulation'],
    answer:
      "Reports have statuses: **Submitted**, **Under review**, **Verified** (triangulated with other evidence), **Unverified**, or **Needs more info**. Verified reports get a badge and may link to evidence. The platform uses neutral language (e.g. 'alleged' / 'reported') until verified.",
  },

  // —— Alerts & contact ——
  {
    keywords: ['alert', 'notification', 'newsletter', 'subscribe', 'sms alert'],
    answer:
      "**Alerts**: You can sign up for **newsletter** digests (daily/weekly or on new verified report) and **SMS alerts** by county (e.g. new verified report in your county). See the **Alerts** section and preferences in the menu.",
  },
  {
    keywords: ['contact', 'about', 'privacy', 'footer', 'support'],
    answer:
      "**About**, **Contact**, and **Privacy Policy** are in the **footer**. Use the Contact page for feedback, reporting issues, or suggestions. For media inquiries, the Press page has boilerplate and contact info.",
  },

  // —— Greetings & thanks ——
  {
    keywords: ['hi', 'hello', 'hey', 'start', 'good morning', 'good afternoon'],
    answer: "__GREETING__",
  },
  {
    keywords: ['thank', 'thanks', 'bye', 'goodbye'],
    answer:
      "You're welcome! Stay informed and report any campaign finance misuse. Have a good day.",
  },
];

export const CHATBOT_GREETING = `Hello! I'm the **Campaign Finance Watch** assistant. I can answer questions about:

• **This project & hackathon** — who built it, TI-Kenya, iLab Africa, tech stack, GitHub, license
• **How to report** misuse (web, SMS, USSD) and report categories
• **Mchango** — contributing to parties via Paystack
• **Map**, **dashboard**, and **transparency** data
• **Learn** — PPF, 0.3%, spending limits, glossary, calculator
• **Export**, **press kit**, **API**, **accessibility**, and **languages**

What would you like to know?`;

export const CHATBOT_FALLBACK =
  "I can help with the **project**, the **hackathon** (TI-Kenya, iLab Africa), **reporting** misuse, **Mchango**, the **map**, **dashboard**, **transparency**, the **Learn** section (PPF, limits, glossary), **export/press**, and **accessibility**. Try: 'What is this hackathon?', 'How do I report?', 'What is Mchango?', or 'What is the PPF?'";
