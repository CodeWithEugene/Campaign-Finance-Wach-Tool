import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get('format') || 'csv';
  const status = searchParams.get('status') || undefined;
  const category = searchParams.get('category') || undefined;
  const county = searchParams.get('county') || undefined;

  try {
    const reports = await convex.query(api.reports.list, {
      status: status as 'submitted' | 'under_review' | 'verified' | 'unverified' | 'needs_more_info' | undefined,
      category: category as
        | 'vote-buying'
        | 'illegal-donations'
        | 'misuse-public-resources'
        | 'undeclared-spending'
        | 'bribery'
        | 'other'
        | undefined,
      county: county || undefined,
      limit: 2000,
    });

    if (format === 'csv') {
      const header = 'id,title,category,location,county,status,createdAt,description\n';
      const rows = reports.map(
        (r) =>
          `${r._id},"${(r.title || '').replace(/"/g, '""')}",${r.category},${(r.location || '').replace(/,/g, ';')},${r.county || ''},${r.status},${new Date(r.createdAt).toISOString()},"${(r.description || '').replace(/"/g, '""')}"`
      );
      const csv = header + rows.join('\n');
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="reports.csv"',
        },
      });
    }

    if (format === 'json') {
      return NextResponse.json(reports, {
        headers: {
          'Content-Disposition': 'attachment; filename="reports.json"',
        },
      });
    }

    return NextResponse.json({ error: 'Format must be csv or json' }, { status: 400 });
  } catch (e) {
    console.error('Export error:', e);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
