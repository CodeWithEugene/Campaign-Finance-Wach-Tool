import { NextRequest, NextResponse } from 'next/server';

const GREETING = `Hello! I'm the Campaign Finance Watch assistant. You can ask me about:
• How to **report** misuse (web, SMS, USSD)
• **Mchango** (contributing to parties via Paystack)
• The **map** and **dashboard**
• **Transparency** and data
• **Learn** section (PPF, limits, glossary)

What would you like to know?`;

function getResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase().trim();
  if (!lower) return GREETING;

  if (/\b(hi|hello|hey|start)\b/.test(lower)) return GREETING;
  if (/\b(thank|thanks|bye)\b/.test(lower)) return "You're welcome! Stay informed and report any campaign finance misuse. Have a good day.";

  if (/\b(report|reporting|submit|evidence)\b/.test(lower)) {
    return "To **report** campaign finance misuse: (1) Use the **Report** link in the menu and fill the form with title, category, description, and location. You can add photos or video and report anonymously. (2) Via **USSD**: dial the shortcode and follow the menu (language → category → description → location → confirm). (3) See the **SMS** instructions page for text reporting.";
  }
  if (/\b(ussd|shortcode|dial)\b/.test(lower)) {
    return "**USSD reporting**: Dial the Campaign Finance Watch shortcode, choose language (English/Kiswahili), select a category (e.g. vote buying, misuse), enter a short description, then your county or town, and confirm. Your report is saved and reviewed by the team.";
  }
  if (/\b(sms|text)\b/.test(lower)) {
    return "You can report via **SMS** too. Check the **Report** section in the menu for the **SMS instructions** page with the number and format to use.";
  }

  if (/\b(mchango|contribute|donate|pay|paystack)\b/.test(lower)) {
    return "**Mchango** lets you contribute to political parties or candidates transparently. Go to **Mchango** in the menu, choose a party, enter the amount (KES), and you'll be redirected to Paystack to pay with M-Pesa or card. Contributions are recorded and visible in the transparency data.";
  }
  if (/\b(map|maps|location)\b/.test(lower)) {
    return "The **Map** page shows reports by location. You can filter by category and status, switch between markers and heat map, and click markers for details. Reports are placed by county when no exact coordinates are given.";
  }
  if (/\b(dashboard|stats|statistics)\b/.test(lower)) {
    return "The **Dashboard** shows overview stats (total reports, this week/month, verified count), charts by category and status, top counties, and recent reports. Use it to see trends and patterns.";
  }
  if (/\b(transparency|transparent|data)\b/.test(lower)) {
    return "The **Transparency** section includes the transparency index and party-level data. You can explore how parties report and compare contributions and compliance.";
  }
  if (/\b(learn|education|ppf|limits|glossary)\b/.test(lower)) {
    return "The **Learn** hub explains campaign funding: the Political Parties Fund (PPF), spending limits, disclosure rules, and a glossary. Use the menu to open **Learn** and its sub-pages.";
  }
  if (/\b(export|download|csv|press)\b/.test(lower)) {
    return "You can **export** reports as CSV from the Reports page (Export button). The **Press** page offers a **Download Press Kit** with a summary and sample data for journalists and researchers.";
  }
  if (/\b(accessibility|access|a11y)\b/.test(lower)) {
    return "Use the **accessibility icon** (bottom right) to turn on high contrast, change text size, dyslexia-friendly font, highlight links, stop animations, and voice narration. The site also supports keyboard navigation and screen readers.";
  }
  if (/\b(contact|about|privacy)\b/.test(lower)) {
    return "Find **About**, **Contact**, and **Privacy Policy** in the footer. For reporting issues or suggestions, use the Contact page.";
  }

  return "I can help with reporting misuse, Mchango contributions, the map, dashboard, transparency, and the Learn section. Try asking something like: 'How do I report?' or 'What is Mchango?'";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const lastUser = messages.filter((m: { role?: string }) => m.role === 'user').pop();
    const userContent = lastUser?.content ?? '';
    const reply = getResponse(userContent);
    return NextResponse.json({ content: reply });
  } catch {
    return NextResponse.json({ content: "Sorry, I couldn't process that. Try asking about reporting, Mchango, or the map." }, { status: 200 });
  }
}
