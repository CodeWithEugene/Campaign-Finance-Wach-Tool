# Campaign Finance Watch Tool — Feature Specification

> Comprehensive feature breakdown for the TI-Kenya Campaign Finance Watch Tool Hackathon.  
> Live URL: https://campaign-finance-wach-tool.vercel.app/

---

## Table of Contents

1. [Information & Education](#1-information--education)
2. [Mchango (Crowdfunding)](#2-mchango-crowdfunding)
3. [Public Reporting Section](#3-public-reporting-section)
4. [Report Categorization](#4-report-categorization)
5. [Geo-Mapping & Heat Maps](#5-geo-mapping--heat-maps)
6. [Disability & Accessibility](#6-disability--accessibility)
7. [Multi-Language Support](#7-multi-language-support)
8. [Dashboards & Visualization](#8-dashboards--visualization)
9. [Alerts & Notifications](#9-alerts--notifications)
10. [API Integration](#10-api-integration)
11. [Language & Terminology Guidelines](#11-language--terminology-guidelines)
12. [Report Download & Export](#12-report-download--export)
13. [Report Verification Workflow](#13-report-verification-workflow)
14. [Whistleblower Protection](#14-whistleblower-protection)
15. [Data Liberation (ORPP PDF Parser)](#15-data-liberation-orpp-pdf-parser)
16. [Spending Limits Timeline & Explainer](#16-spending-limits-timeline--explainer)
17. [PPF Formula Calculator](#17-ppf-formula-calculator)
18. [Transparency Index](#18-transparency-index)
19. [SMS Reporting](#19-sms-reporting)
20. [USSD Reporting](#20-ussd-reporting)
21. [County-Level View](#21-county-level-view)
22. [Historical Trends](#22-historical-trends)
23. [Fact-Checking & Credibility](#23-fact-checking--credibility)
24. [Press & Research Toolkit](#24-press--research-toolkit)

---

## 1. Information & Education

### 1.1 Campaign Funding Overview
- **1.1.1** Display summary of how political parties and candidates receive funding in Kenya
- **1.1.2** Explain the two main sources: (a) Political Parties Fund (0.3% of National Revenue), (b) Membership, contributions, donations
- **1.1.3** Link to relevant legal provisions: Political Parties Act 2011, Constitution Article 88(4)(i)
- **1.1.4** Provide downloadable PDF summaries for offline reading

### 1.2 The 0.3% Political Parties Fund
- **1.2.1** Explain that 0.3% of National Revenue goes to the Political Parties Fund
- **1.2.2** Show current and historical National Revenue figures (when available)
- **1.2.3** Calculate and display total PPF pool per financial year
- **1.2.4** Link to ORPP as the administering body

### 1.3 PPF Distribution Formula
- **1.3.1** Explain the four-way split:
  - 5% for ORPP administration expenses
  - 10% proportional to elected representatives (MPs, Senators, Governors, MCAs) from last general election
  - 15% proportional to Special Interest Groups (SIG) representatives
  - 70% proportional to total votes received in preceding general election
- **1.3.2** Provide worked examples with real party data
- **1.3.3** Interactive breakdown per party (see Section 17)

### 1.4 Legal Spending Limits (Historical & Current)
- **1.4.1** Explain the Election Campaign Financing Act 2013 (No. 42 of 2013)
- **1.4.2** Document 2017 limits: Presidential candidates KSh 4.4 billion
- **1.4.3** Explain October 2021 revocation: IEBC withdrew limits after Parliament rejected regulations
- **1.4.4** State current status: No enforceable limits; constitutional mandate (Article 88(4)(i)) remains unfulfilled
- **1.4.5** Link to court petitions E540/2021 and E546/2021 (Katiba Institute, TI-Kenya vs IEBC/Speaker)

### 1.5 Expenditure Period
- **1.5.1** Define campaign expenditure period (e.g., six months prior to general election for 2017)
- **1.5.2** Show election calendar and relevant periods for 2027

### 1.6 Legal Literacy Section
- **1.6.1** Plain-language explainers for key legal terms
- **1.6.2** FAQ: "What can parties spend on?" "Who must disclose?" "What are the penalties?"
- **1.6.3** Glossary of terms (PPF, ORPP, IEBC, ECF Act, etc.)

---

## 2. Mchango (Crowdfunding)

### 2.1 Payment Integration (Paystack)
- **2.1.1** Integrate Paystack API for card and mobile money payments
- **2.1.2** Support Paystack M-Pesa option for Kenyan mobile money (where available)
- **2.1.3** Store Paystack public key in frontend env; secret key server-side only
- **2.1.4** Implement webhook handler for payment confirmation (success, failed, abandoned)
- **2.1.5** Generate unique transaction references per contribution
- **2.1.6** Support recurring contributions (optional monthly)

### 2.2 Contribution Flow
- **2.2.1** User selects: Political party OR Individual candidate
- **2.2.2** Search/filter parties by name; filter candidates by constituency, position
- **2.2.3** User enters amount (KES); enforce minimum (e.g., KES 100) and maximum (e.g., KES 1,000,000)
- **2.2.4** Display clear breakdown: amount, Paystack fee (if any), net to recipient
- **2.2.5** Optional: Add message or "in support of" note (moderated)
- **2.2.6** Redirect to Paystack checkout; return to success/cancel URL

### 2.3 Post-Payment
- **2.2.7** Show receipt with transaction ID, amount, date, recipient
- **2.2.8** Email receipt (if user provides email)
- **2.2.9** Optional: Anonymous vs. named contribution (for transparency dashboard)

### 2.4 Transparency of Mchango
- **2.4.1** Public dashboard of total contributions per party/candidate (aggregate only, no individual amounts)
- **2.4.2** Count of contributors (without identifying them)
- **2.4.3** Time-series of contributions (daily/weekly/monthly)
- **2.4.4** Export contribution summary for auditors

### 2.5 Compliance
- **2.5.1** Disclaimer: Contributions must comply with Kenyan law (e.g., foreign donations restrictions)
- **2.5.2** Log IP, timestamp, user agent for audit trail
- **2.5.3** Rate limiting to prevent abuse

---

## 3. Public Reporting Section

### 3.1 Report Submission (Web)
- **3.1.1** Web form: Title, Description, Category (see Section 4), Location (address or coordinates)
- **3.1.2** Media upload: Images (JPEG, PNG; max 5MB each; max 5 images), Videos (MP4, max 50MB; max 1 video)
- **3.1.3** Optional: Date/time of incident, witnesses
- **3.1.4** Anonymous option: No name, email, or phone required
- **3.1.5** If not anonymous: Optional email for follow-up (stored securely)
- **3.1.6** Client-side validation; server-side validation and sanitization
- **3.1.7** CAPTCHA or honeypot to reduce bots

### 3.2 Report Submission (SMS)
- **3.2.1** Shortcode (e.g., 38383) for SMS reporting
- **3.2.2** Format: `REPORT [category code] [brief description] [location]`
- **3.2.3** Auto-reply with report ID and confirmation
- **3.2.4** Store SMS in database with phone number (hashed for anonymous option), timestamp, raw text
- **3.2.5** Admin interface to triage SMS reports and link to full report if needed

### 3.3 Report Submission (USSD)
- **3.3.1** USSD code (e.g., *384*1234#) for feature-phone users
- **3.3.2** Menu flow:
  - Welcome → Select language (1 English, 2 Kiswahili)
  - Select category (1 Vote buying, 2 Illegal donations, 3 Misuse of public resources, 4 Other)
  - Enter brief description (text input)
  - Enter location (county or town)
  - Confirm and submit
- **3.3.3** Callback URL: `https://campaign-finance-wach-tool.vercel.app/api/ussd` (or equivalent)
- **3.3.4** Session management: Store sessionId, phoneNumber, current menu state
- **3.3.5** Return CON response for continuation, END for final message
- **3.3.6** On submit: Create report in DB; return "Thank you. Report ID: XXX. We will review it."
- **3.3.7** Africa's Talking USSD API integration; handle POST with sessionId, serviceCode, phoneNumber, text

### 3.4 Media Handling
- **3.4.1** Strip EXIF metadata from images (privacy)
- **3.4.2** Store files in secure object storage (e.g., S3, Cloudflare R2)
- **3.4.3** Generate thumbnails for list views
- **3.4.4** Optional: Blur faces in public view; full image for verified reviewers only

---

## 4. Report Categorization

### 4.1 Primary Categories
- **4.1.1** Vote buying — Offering money/goods for votes
- **4.1.2** Illegal donations — Donations from prohibited sources (e.g., foreign entities, above limits)
- **4.1.3** Misuse of public resources — Use of government vehicles, offices, staff for campaigns
- **4.1.4** Undeclared spending — Campaign expenditure not reported to IEBC
- **4.1.5** Bribery of officials — Attempts to influence electoral or party officials
- **4.1.6** Other — Free-text subcategory

### 4.2 Subcategories (Optional)
- **4.2.1** Under "Vote buying": Cash, food, goods, transport
- **4.2.2** Under "Misuse of public resources": Vehicles, buildings, personnel, state media
- **4.2.3** Under "Illegal donations": Foreign source, anonymous above threshold, corporate

### 4.3 Tagging
- **4.3.1** Allow multiple tags per report (e.g., #vote-buying #county-level)
- **4.3.2** Filter reports by tag in dashboard and map
- **4.3.3** Admin can add/remove tags during verification

### 4.4 Auto-Categorization (Future)
- **4.4.1** Optional: NLP/keyword matching to suggest category from description
- **4.4.2** Admin confirms or overrides suggestion

---

## 5. Geo-Mapping & Heat Maps

### 5.1 Interactive Map
- **5.1.1** Base map: OpenStreetMap or Mapbox (Kenya-focused)
- **5.1.2** Plot each report as marker; cluster when zoomed out
- **5.1.3** Click marker: Popup with title, category, date, verification status, link to full report
- **5.1.4** Filter by category, date range, verification status
- **5.1.5** Search by location (county, constituency, town)
- **5.1.6** Responsive: Works on mobile and desktop

### 5.2 Heat Maps
- **5.2.1** Density layer: Heat map of report concentration
- **5.2.2** Toggle between marker view and heat map
- **5.2.3** Filter heat map by category (e.g., vote buying only)
- **5.2.4** Time slider: Animate reports over time (e.g., by week)

### 5.3 County & Constituency Boundaries
- **5.3.1** Optional overlay of Kenya's 47 counties
- **5.3.2** Optional overlay of constituencies
- **5.3.3** Click county: Show aggregate stats (report count, top categories)
- **5.3.4** Reference: Ushahidi/Uchaguzi patterns; differentiate with verification and transparency focus

### 5.4 Export Map View
- **5.4.1** Export current map view as PNG/PDF for reports
- **5.4.2** Include legend and date range in export

---

## 6. Disability & Accessibility

### 6.1 Screen Reader Support
- **6.1.1** Semantic HTML (nav, main, article, section)
- **6.1.2** ARIA labels for interactive elements (buttons, links, form fields)
- **6.1.3** ARIA live regions for dynamic content (alerts, notifications)
- **6.1.4** Skip links: "Skip to main content"
- **6.1.5** Alt text for all meaningful images and charts
- **6.1.6** Test with NVDA, JAWS, VoiceOver

### 6.2 Keyboard Navigation
- **6.2.1** All interactive elements focusable via Tab
- **6.2.2** Logical tab order
- **6.2.3** Visible focus indicator (outline)
- **6.2.4** Escape to close modals; Enter/Space to activate
- **6.2.5** No keyboard traps

### 6.3 Visual Accessibility
- **6.3.1** High-contrast mode toggle (WCAG AA minimum)
- **6.3.2** Resizable text (up to 200% without loss of functionality)
- **6.3.3** Color not sole indicator (use icons, labels)
- **6.3.4** Minimum touch target 44x44px on mobile

### 6.4 Cognitive Accessibility
- **6.4.1** Simple language option: Shorter sentences, common words
- **6.4.2** Clear headings and structure
- **6.4.3** Progress indicators for multi-step forms
- **6.4.4** Error messages in plain language with suggested fix

### 6.5 Alternative Content
- **6.4.5** Audio summary option for key dashboards (future: text-to-speech)
- **6.4.6** Data tables with proper headers for screen readers
- **6.4.7** Ensure charts have text alternatives (e.g., data table below chart)

---

## 7. Multi-Language Support

### 7.1 Supported Languages (Priority)
- **7.1.1** English (default)
- **7.1.2** Kiswahili
- **7.1.3** Kikuyu
- **7.1.4** Luo
- **7.1.5** Luhya
- **7.1.6** Kalenjin
- **7.1.7** Kamba

### 7.2 Implementation
- **7.2.1** Use i18n library (e.g., next-intl, react-i18next)
- **7.2.2** Store translations in JSON per language
- **7.2.3** Language switcher in header/footer
- **7.2.4** Persist language preference (localStorage/cookie)
- **7.2.5** URL-based locale (e.g., /sw/..., /en/...)

### 7.3 Content Translation
- **7.3.1** Translate UI strings (buttons, labels, errors)
- **7.3.2** Translate static content (info pages, FAQs)
- **7.3.3** Report categories and tags in all languages
- **7.3.4** User-generated content (reports): Display in original; optional machine translation for display

### 7.4 RTL & Vernacular
- **7.4.1** Ensure vernacular scripts render correctly (Unicode)
- **7.4.2** SMS: Support Unicode for vernacular (70-char limit for Unicode SMS)
- **7.4.3** Consider character limits for vernacular (often longer than English)

---

## 8. Dashboards & Visualization

### 8.1 Overview Dashboard
- **8.1.1** Total reports (all time, this month, this week)
- **8.1.2** Reports by category (pie/bar chart)
- **8.1.3** Reports by verification status (verified, under review, unverified)
- **8.1.4** Top 5 counties by report count
- **8.1.5** Recent reports list (last 10)
- **8.1.6** Mchango totals (if public)

### 8.2 Party/Candidate Dashboard
- **8.2.1** Per-party: PPF received, Mchango received, report count (allegations)
- **8.2.2** Per-candidate: Similar metrics
- **8.2.3** Transparency Index (see Section 18)
- **8.2.4** Trend over time

### 8.3 Chart Types
- **8.3.1** Bar charts: Category comparison, county comparison
- **8.3.2** Line charts: Trends over time
- **8.3.3** Pie/donut: Category distribution
- **8.3.4** Tables: Sortable, filterable data
- **8.3.5** Use library: Chart.js, Recharts, or D3

### 8.4 Interactivity
- **8.4.1** Click chart segment to filter map/dashboard
- **8.4.2** Hover tooltips with exact values
- **8.4.3** Date range picker for time-filtered views
- **8.4.4** Export chart as PNG/SVG

### 8.5 Mobile Dashboards
- **8.5.1** Simplified mobile layout
- **8.5.2** Swipeable cards for key metrics
- **8.5.3** Tap to expand details

---

## 9. Alerts & Notifications

### 9.1 Newsletter
- **9.1.1** Email signup form (double opt-in)
- **9.1.2** Digest options: Daily, weekly, or on new verified report
- **9.1.3** Content: New reports summary, top categories, map snapshot, link to platform
- **9.1.4** Unsubscribe link in every email
- **9.1.5** Use service: Resend, SendGrid, Mailchimp, or similar

### 9.2 In-App Notifications
- **9.2.1** Bell icon with unread count (for logged-in users)
- **9.2.2** "New report in your county" (if user has set location)
- **9.2.3** Mark as read; clear all

### 9.3 SMS Alerts
- **9.3.1** Opt-in: User sends "ALERT [county code]" to shortcode
- **9.3.2** Send SMS when new verified report in that county
- **9.3.3** Rate limit: Max 1 SMS per day per user
- **9.3.4** Opt-out: "STOP" to shortcode

### 9.4 Push Notifications (Future)
- **9.4.1** Web push for desktop/mobile browsers
- **9.4.2** Opt-in required

---

## 10. API Integration

### 10.1 External Data Sources
- **10.1.1** ORPP: Political Parties Fund distribution (PDF → parsed data)
- **10.1.2** OAG: Political parties audit reports (links + metadata)
- **10.1.3** IEBC: Campaign finance data (when/if API available)
- **10.1.4** Kenya Open Data Initiative (if relevant datasets exist)

### 10.2 ORPP PDF Parser (Data Liberation)
- **10.2.1** Download ORPP PPF distribution PDFs (2013/14 through 2023/24)
- **10.2.2** Parse tables: Party name, amount allocated, financial year
- **10.2.3** Store in structured DB (party, amount, year)
- **10.2.4** Run parser periodically (manual or cron) when new PDFs published
- **10.2.5** Source URL: orpp.or.ke documents
- **10.2.6** Fallback: Manual CSV upload if parser fails

### 10.3 Public API (Outbound)
- **10.3.1** REST API for researchers/journalists: GET /api/reports, /api/parties, /api/contributions
- **10.3.2** Pagination, filtering by date, category, county
- **10.3.3** API key or rate limit for heavy usage
- **10.3.4** OpenAPI/Swagger documentation

### 10.4 Webhooks (Future)
- **10.4.1** Allow external systems to subscribe to new report events
- **10.4.2** Payload: report ID, category, location, timestamp

---

## 11. Language & Terminology Guidelines

### 11.1 Avoid
- **11.1.1** "High risk" / "Low risk" — Implies judgment
- **11.1.2** "Corrupt" / "Corruption" in UI — Use neutral terms until verified
- **11.1.3** "Guilty" / "Innocent" — Reports are allegations

### 11.2 Use Instead
- **11.2.1** "Transparency score" / "Transparency index" — Objective metrics
- **11.2.2** "Alleged" / "Reported" — For unverified reports
- **11.2.3** "Verified" / "Under review" / "Unverified" — For status
- **11.2.4** "Disclosure level" — For how much a party discloses
- **11.2.5** "Compliance status" — For audit/legal compliance

### 11.3 Tone
- **11.3.1** Neutral, factual, educational
- **11.3.2** Empower citizens without sensationalism

---

## 12. Report Download & Export

### 12.1 Formats
- **12.1.1** CSV: Reports list with columns (ID, title, category, date, county, status, description)
- **12.1.2** PDF: Formatted report pack (cover, summary stats, report list, map screenshot)
- **12.1.3** Excel: Same as CSV with formatting (optional)

### 12.2 Filters for Export
- **12.2.1** Apply same filters as dashboard (date range, category, county, verification status)
- **12.2.2** "Export current view" button
- **12.2.3** Max export limit (e.g., 10,000 rows) to prevent abuse

### 12.3 Press Kit
- **12.3.1** One-click "Press Kit" download: Logo, key stats, sample charts, boilerplate text
- **12.3.2** ZIP file with PNGs, PDF summary, CSV sample

### 12.4 Embeddable Widgets
- **12.4.1** Iframe embed: Mini dashboard or map for news sites
- **12.4.2** Configurable: County, date range, chart type

---

## 13. Report Verification Workflow

### 13.1 States
- **13.1.1** Submitted — New, not yet reviewed
- **13.1.2** Under review — Assigned to reviewer
- **13.1.3** Verified — Triangulated with other evidence; approved for public "verified" badge
- **13.1.4** Unverified — Insufficient evidence or false
- **13.1.5** Needs more info — Reviewer requested additional details from submitter

### 13.2 Reviewer Actions
- **13.2.1** Assign to self
- **13.2.2** Change status
- **13.2.3** Add internal notes (not public)
- **13.2.4** Add verification note (public): "Verified via cross-reference with media report X"
- **13.2.5** Request info from submitter (if contact available)
- **13.2.6** Merge duplicate reports

### 13.3 Triangulation
- **13.3.1** Link report to related reports (same incident)
- **13.3.2** Link to external sources (news articles, official statements)
- **13.3.3** Display "Evidence" section on verified reports

### 13.4 Audit Trail
- **13.4.1** Log all status changes with timestamp and reviewer ID
- **13.4.2** Immutable for compliance

---

## 14. Whistleblower Protection

### 14.1 Anonymous Reporting
- **14.1.1** No signup required for report submission
- **14.1.2** No collection of IP (or hash only for rate limiting)
- **14.1.3** Optional secure contact: Encrypted messaging for follow-up (e.g., SecureDrop-style)
- **14.1.4** Clear notice: "Your identity will not be stored or shared"

### 14.2 Data Minimization
- **14.2.1** Strip EXIF from uploads
- **14.2.2** Don't log user agent beyond generic "mobile/desktop"
- **14.2.3** Auto-delete optional contact info after 90 days if no follow-up

### 14.3 Secure Storage
- **14.3.1** Encrypt sensitive fields at rest
- **14.3.2** HTTPS only
- **14.3.3** Access control: Only verified reviewers see full report details

### 14.4 Legal Disclaimer
- **14.4.1** "We cannot guarantee anonymity in all circumstances (e.g., legal subpoena). Use your judgment."
- **14.4.2** Link to TI-Kenya's whistleblower policy if available

---

## 15. Data Liberation (ORPP PDF Parser)

### 15.1 Scope
- **15.1.1** Parse ORPP PPF distribution PDFs from orpp.or.ke
- **15.1.2** Financial years: 2013/14 through 2023/24 (and future)
- **15.1.3** Extract: Party name, amount (KES), year

### 15.2 Parser Logic
- **15.2.1** Use PDF library (e.g., pdf-parse, PyMuPDF) to extract text/tables
- **15.2.2** Handle table structure variations across years
- **15.2.3** Normalize party names (e.g., "ODM" vs "Orange Democratic Movement")
- **15.2.4** Validate amounts (numeric, reasonable range)
- **15.2.5** Output: JSON or direct DB insert

### 15.3 Storage
- **15.3.1** Table: orpp_ppf_allocations (party_id, year, amount, source_url)
- **15.3.2** Keep source PDF URL for audit
- **15.3.3** Version history if PDF is updated

### 15.4 Display
- **15.4.1** "Data sources" page with link to ORPP
- **15.4.2** "Last updated" timestamp
- **15.4.3** Use in dashboards, PPF calculator, historical trends

---

## 16. Spending Limits Timeline & Explainer

### 16.1 Timeline Component
- **16.1.1** Visual timeline: 2013 (Act enacted) → 2014 (in force) → 2017 (limits set) → 2021 (revoked) → present
- **16.1.2** Each node: Date, event, short explanation
- **16.1.3** Click to expand: Full context, links to court petitions, news

### 16.2 Explainer Content
- **16.2.1** "What the law intended" vs "What happened"
- **16.2.2** Why limits were revoked (Parliament rejected regulations)
- **16.2.3** Constitutional gap: Article 88(4)(i) still requires IEBC to regulate
- **16.2.4** Advocacy angle: "Citizens can demand implementation"

### 16.3 Links
- **16.3.1** Katiba Institute & TI-Kenya petitions (E540, E546)
- **16.3.2** IEBC gazette notices
- **16.3.3** Kenya Law: Election Campaign Financing Act

---

## 17. PPF Formula Calculator

### 17.1 Inputs
- **17.1.1** Total votes received (or select party from dropdown)
- **17.1.2** Number of elected representatives (MPs, Senators, Governors, MCAs)
- **17.1.3** Number of Special Interest Group representatives
- **17.1.4** Total PPF pool (default: current year from ORPP data)

### 17.2 Calculation
- **17.2.1** 70% share = (party_votes / total_votes) * 0.70 * pool
- **17.2.2** 10% share = (party_reps / total_reps) * 0.10 * pool
- **17.2.3** 15% share = (party_sig / total_sig) * 0.15 * pool
- **17.2.4** Sum = estimated allocation
- **17.2.5** 5% admin deducted from pool before distribution

### 17.3 UI
- **17.3.1** Sliders or inputs for "what if" scenarios
- **17.3.2** Real-time update of result
- **17.3.3** Compare two parties side by side
- **17.3.4** "How does my party compare?" — Pre-fill from ORPP data if available

---

## 18. Transparency Index

### 18.1 Components
- **18.1.1** Disclosure score: Does party publish audited accounts? Timely?
- **18.1.2** PPF compliance: Did they receive PPF? Audit clean?
- **18.1.3** Mchango transparency: Publish contribution totals?
- **18.1.4** Report volume: Number of allegations (inverse — more reports may indicate more scrutiny, not necessarily more wrongdoing)
- **18.1.5** Verification rate: % of reports about party that were verified (nuanced)

### 18.2 Calculation
- **18.2.1** Weighted formula (weights TBD with TI-Kenya)
- **18.2.2** Score 0–100 or 0–10
- **18.2.3** Methodology page: Explain each component
- **18.2.4** Update frequency: Quarterly or when new data available

### 18.3 Display
- **18.3.1** Ranked list of parties
- **18.3.2** Per-party detail page with breakdown
- **18.3.3** Compare two or more parties
- **18.3.4** Historical trend of index over time

---

## 19. SMS Reporting

### 19.1 Africa's Talking SMS
- **19.1.1** Create SMS shortcode (e.g., 38383) via Africa's Talking
- **19.1.2** Inbound SMS webhook: POST to /api/sms/inbound
- **19.1.3** Parse message: REPORT [category] [description] [location]
- **19.1.4** Create report in DB; reply with "Report received. ID: XXX. Thank you."
- **19.1.5** Handle malformed messages: "Invalid format. Send: REPORT [1-6] [description] [location]"

### 19.2 Format Documentation
- **19.2.1** Publish format on website: "To report via SMS, send..."
- **19.2.2** Category codes: 1=Vote buying, 2=Illegal donations, 3=Misuse, 4=Undeclared, 5=Bribery, 6=Other

### 19.3 Cost & Limits
- **19.3.1** Rate limit: Max 5 reports per phone per day
- **19.3.2** Consider cost of inbound SMS (Africa's Talking pricing)

---

## 20. USSD Reporting

### 20.1 Africa's Talking USSD
- **20.1.1** Create USSD channel in Africa's Talking dashboard
- **20.1.2** Service code (e.g., *384*1234#)
- **20.1.3** Callback URL: https://campaign-finance-wach-tool.vercel.app/api/ussd
- **20.1.4** Method: POST; Content-Type: application/x-www-form-urlencoded or application/json

### 20.2 Request Parameters (Africa's Talking)
- **20.2.1** sessionId — Unique per session
- **20.2.2** serviceCode — e.g., *384*1234#
- **20.2.3** phoneNumber — e.g., +254712345678
- **20.2.4** text — User input so far, separated by * (e.g., "1*2*My description")

### 20.3 Response Format
- **20.3.1** CON — Continue session: `CON [message]\n[menu options]`
- **20.3.2** END — End session: `END [message]`
- **20.3.3** Max response length ~1820 chars (split if needed)

### 20.4 Menu Flow
- **20.4.1** Step 0 (text empty): Welcome; 1 English, 2 Kiswahili
- **20.4.2** Step 1: Category — 1 Vote buying, 2 Illegal donations, 3 Misuse, 4 Undeclared, 5 Bribery, 6 Other
- **20.4.3** Step 2: "Enter brief description (max 160 chars):"
- **20.4.4** Step 3: "Enter county or town:"
- **20.4.5** Step 4: "Confirm? 1 Yes, 2 No"
- **20.4.6** Step 5 (Yes): Save report; END "Thank you. Report ID: XXX. We will review it."

### 20.5 Session State
- **20.5.1** Store sessionId → { step, language, category, description, location } in cache (Redis or server memory with TTL)
- **20.5.2** TTL: 5 minutes (USSD sessions timeout quickly)
- **20.5.3** Parse `text` to determine current step (split by *)

### 20.6 Edge Cases
- **20.6.1** Invalid input: Show error, re-prompt
- **20.6.2** Back: Option 0 to go back one step (optional)
- **20.6.3** Timeout: Session expires; user can start over

### 20.7 Implementation
- **20.7.1** Serverless function: Vercel serverless /api/ussd/route.ts (or route.js)
- **20.7.2** Parse POST body; route by text/step
- **20.7.3** Return plain text response (no HTML)
- **20.7.4** Ensure response time < 5 seconds (Africa's Talking timeout)

---

## 21. County-Level View

### 21.1 County Dashboard
- **21.1.1** List of 47 counties with report count, top category
- **21.1.2** Click county: Drill-down to constituency level
- **21.1.3** Governor race context: Link to governor candidates if data available

### 21.2 County Comparison
- **21.2.1** Compare 2–5 counties side by side
- **21.2.2** Metrics: Report count, category breakdown, Mchango by county (if applicable)

### 21.3 TI-Kenya ALAC Regions
- **21.3.1** Map ALAC offices: Mombasa (Coast), Eldoret (Rift Valley), Kisumu (Western), Nairobi
- **21.3.2** "Report to ALAC" link for legal advice (if TI-Kenya provides)
- **21.3.3** Regional contact info

---

## 22. Historical Trends

### 22.1 PPF Over Time
- **22.1.1** Line chart: PPF allocation per party by financial year
- **22.1.2** Stacked area: Total PPF by year
- **22.1.3** Party ranking change over time

### 22.2 Reports Over Time
- **22.2.1** Reports by month (e.g., spike around elections)
- **22.2.2** Category trends
- **22.2.3** County trends

### 22.3 Election Cycles
- **22.3.1** Annotate 2013, 2017, 2022 elections on timeline
- **22.3.2** Compare report volume: 2017 vs 2022
- **22.3.3** Prepare for 2027

---

## 23. Fact-Checking & Credibility

### 23.1 Verification Badge
- **23.1.1** "Verified" badge on reports that passed triangulation
- **23.1.2** Tooltip: "Verified via [method]"
- **23.1.3** "Under review" badge for in-progress
- **23.1.4** No badge for unverified

### 23.2 Source Linking
- **23.2.1** Link verified reports to news articles, official statements
- **23.2.2** "Evidence" section with URLs
- **23.2.3** Archive links (e.g., Wayback Machine) for dead links

### 23.3 Disinformation Guard
- **23.3.1** Flag reports that contradict verified facts (admin only)
- **23.3.2** Don't publish; log for analysis
- **23.3.3** Optional: "Report debunked" with explanation

---

## 24. Press & Research Toolkit

### 24.1 One-Click Export
- **24.1.1** "Export for press" button: CSV + PDF summary + key charts
- **24.1.2** Date range, category filters
- **24.1.3** ZIP download

### 24.2 Boilerplate
- **24.2.1** "About Campaign Finance Watch" text for journalists
- **24.2.2** Key stats (updated)
- **24.2.3** Contact for media inquiries

### 24.3 Embeddable Widgets
- **24.3.1** Map widget: iframe with configurable filters
- **24.3.2** Chart widget: Bar chart of reports by category
- **24.3.3** Copy-paste embed code

### 24.4 API for Researchers
- **24.4.1** Documented REST API
- **24.4.2** Bulk download (with rate limit)
- **24.4.3** Citation format: "Data from Campaign Finance Watch Tool, TI-Kenya, [date]"

---

## Technical Notes

- **Stack**: Next.js (or similar) on Vercel
- **Payments**: Paystack (secret + public keys in env)
- **USSD/SMS**: Africa's Talking
- **Live URL**: https://campaign-finance-wach-tool.vercel.app/
- **USSD Callback**: https://campaign-finance-wach-tool.vercel.app/api/ussd