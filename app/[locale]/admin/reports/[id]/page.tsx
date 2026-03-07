'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const statuses = ['submitted', 'under_review', 'verified', 'unverified', 'needs_more_info'] as const;

export default function AdminReportDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname?.split('/')[1] || 'en';
  const id = params?.id as Id<'reports'>;
  const { data: session } = useSession();
  const report = useQuery(api.reports.get, id ? { id } : 'skip');
  const updateStatus = useMutation(api.reports.updateStatus);
  const assign = useMutation(api.reports.assign);
  const addNote = useMutation(api.reports.addNote);
  const [status, setStatus] = useState('');
  const [publicNote, setPublicNote] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [saving, setSaving] = useState(false);

  const adminEmail = (session?.user?.email as string) || '';

  async function handleStatusChange() {
    if (!status || !report) return;
    setSaving(true);
    try {
      await updateStatus({
        id,
        status: status as (typeof statuses)[number],
        adminEmail,
        publicVerificationNote: publicNote || undefined,
        internalNotes: internalNote || report.internalNotes || undefined,
        assignToSelf: true,
      });
      setStatus('');
      setPublicNote('');
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleAssign() {
    setSaving(true);
    try {
      await assign({ id, adminEmail });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveNotes() {
    setSaving(true);
    try {
      await addNote({
        id,
        adminEmail,
        internalNotes: internalNote || undefined,
        publicVerificationNote: publicNote || undefined,
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (report === undefined) return <div className="py-12">Loading...</div>;
  if (report === null) return <div className="py-12">Report not found.</div>;

  return (
    <div className="space-y-8">
      <Link href={`/${locale}/admin/reports`} className="text-[var(--accent-1)] hover:underline">
        ← Back to reports
      </Link>

      <div>
        <h1 className="font-display font-black text-2xl mb-2">{report.title}</h1>
        <p className="text-[var(--text-secondary)]">
          {report.category} • {report.location}
          {report.county && ` • ${report.county}`} •{' '}
          {new Date(report.createdAt).toLocaleString()}
        </p>
        <span className="inline-block mt-2 px-2 py-1 rounded text-sm bg-[var(--bg-primary)]">
          {report.status.replace(/_/g, ' ')}
        </span>
        {report.assignedTo && (
          <p className="text-sm text-[var(--text-secondary)] mt-2">Assigned to: {report.assignedTo}</p>
        )}
      </div>

      <Card>
        <h2 className="font-display font-bold mb-2">Description</h2>
        <p className="text-[var(--text-secondary)] whitespace-pre-wrap">{report.description}</p>
      </Card>

      {report.publicVerificationNote && (
        <Card>
          <h2 className="font-display font-bold mb-2">Public verification note</h2>
          <p className="text-[var(--text-secondary)]">{report.publicVerificationNote}</p>
        </Card>
      )}

      <Card>
        <h2 className="font-display font-bold mb-4">Actions</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Change status</label>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
              >
                <option value="">Select...</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusChange}
                disabled={!status || saving}
                className="px-4 py-2 bg-[var(--accent-1)] text-white font-bold rounded-lg disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </div>
          <div>
            <button
              onClick={handleAssign}
              disabled={saving}
              className="px-4 py-2 border border-[var(--border-color)] rounded-lg hover:border-[var(--accent-1)]"
            >
              Assign to me
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-display font-bold mb-4">Notes</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Internal notes (not public)</label>
            <textarea
              value={internalNote || report.internalNotes || ''}
              onChange={(e) => setInternalNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Public verification note</label>
            <textarea
              value={publicNote || report.publicVerificationNote || ''}
              onChange={(e) => setPublicNote(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]"
            />
          </div>
          <button
            onClick={handleSaveNotes}
            disabled={saving}
            className="px-4 py-2 bg-[var(--accent-1)] text-white font-bold rounded-lg disabled:opacity-50"
          >
            Save notes
          </button>
        </div>
      </Card>
    </div>
  );
}
