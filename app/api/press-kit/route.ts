import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function GET() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json({ error: 'Press kit not configured' }, { status: 503 });
  }

  try {
    const convex = new ConvexHttpClient(convexUrl);
    const [reports, stats] = await Promise.all([
      convex.query(api.reports.list, { limit: 100 }),
      convex.query(api.reports.dashboardStats),
    ]);

    const summary = `
Campaign Finance Watch Tool — Press Kit
Generated: ${new Date().toISOString().split('T')[0]}

Key statistics:
- Total reports: ${stats.total}
- This week: ${stats.thisWeek}
- This month: ${stats.thisMonth}
- Verified: ${stats.byStatus?.verified ?? 0}
- Under review: ${stats.byStatus?.under_review ?? 0}

Top categories:
${(stats.byCategory && Object.entries(stats.byCategory).map(([k, v]) => `- ${k}: ${v}`).join('\n')) || 'N/A'}

Top counties:
${(stats.topCounties && stats.topCounties.map((c) => `- ${c.name}: ${c.count}`).join('\n')) || 'N/A'}
`;

    const csvHeader = 'id,title,category,location,county,status,createdAt\n';
    const csvRows = reports.map(
      (r) =>
        `${r._id},"${(r.title || '').replace(/"/g, '""')}",${r.category},${(r.location || '').replace(/,/g, ';')},${r.county || ''},${r.status},${new Date(r.createdAt).toISOString()}`
    );
    const csv = csvHeader + csvRows.join('\n');

    const body = [
      { name: 'summary.txt', content: summary },
      { name: 'reports_sample.csv', content: csv },
    ];

    const boundary = '----PressKitBoundary' + Date.now();
    const parts = body.map(
      (f) =>
        `--${boundary}\r\nContent-Disposition: form-data; name="${f.name}"\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${f.content}\r\n`
    );
    const multipart = parts.join('') + `--${boundary}--\r\n`;

    return new NextResponse(multipart, {
      headers: {
        'Content-Type': `multipart/mixed; boundary=${boundary}`,
        'Content-Disposition': 'attachment; filename="press-kit.txt"',
      },
    });
  } catch (e) {
    console.error('Press kit error:', e);
    return NextResponse.json({ error: 'Failed to generate press kit' }, { status: 500 });
  }
}
