import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

function sanitizeCsvCell(value: string): string {
  // Prevent CSV injection: values starting with formula triggers must be quoted and prefixed
  const dangerous = /^[=+\-@\t\r]/;
  const escaped = value.replace(/"/g, '""');
  if (dangerous.test(value)) {
    return `"'${escaped}"`;
  }
  return `"${escaped}"`;
}

export async function GET(request: NextRequest) {
  // Require admin authentication
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  const role = (session.user as { role?: string })?.role;
  if (role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json({ error: 'Export not configured' }, { status: 503 });
  }

  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get('format') || 'csv';
  const status = searchParams.get('status') || undefined;
  const category = searchParams.get('category') || undefined;
  const county = searchParams.get('county') || undefined;

  try {
    const convex = new ConvexHttpClient(convexUrl);
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
        (r: { _id: string; title?: string; category: string; location?: string; county?: string; status: string; createdAt: number; description?: string }) =>
          [
            r._id,
            sanitizeCsvCell(r.title || ''),
            r.category,
            sanitizeCsvCell(r.location || ''),
            sanitizeCsvCell(r.county || ''),
            r.status,
            new Date(r.createdAt).toISOString(),
            sanitizeCsvCell(r.description || ''),
          ].join(',')
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
