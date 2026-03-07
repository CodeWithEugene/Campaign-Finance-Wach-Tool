'use client';

import { useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { Card } from '@/components/ui/Card';

const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['vote-buying', 'illegal-donations', 'misuse-public-resources', 'undeclared-spending', 'bribery', 'other']),
  location: z.string().min(2, 'Location is required'),
  anonymous: z.boolean().default(false),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().max(0).optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

const categories = [
  { value: 'vote-buying', label: 'Vote buying' },
  { value: 'illegal-donations', label: 'Illegal donations' },
  { value: 'misuse-public-resources', label: 'Misuse of public resources' },
  { value: 'undeclared-spending', label: 'Undeclared spending' },
  { value: 'bribery', label: 'Bribery of officials' },
  { value: 'other', label: 'Other' },
];

const MAX_IMAGES = 5;
const MAX_VIDEO = 1;
const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 50;

export default function ReportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const createReport = useMutation(api.reports.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: { anonymous: false, website: '' },
  });

  const isAnonymous = watch('anonymous');

  async function uploadFiles(): Promise<Id<'_storage'>[]> {
    const ids: Id<'_storage'>[] = [];
    const allFiles = [...imageFiles, ...(videoFile ? [videoFile] : [])];
    for (const file of allFiles) {
      const url = await generateUploadUrl();
      const res = await fetch(url, { method: 'POST', body: file });
      if (!res.ok) throw new Error('Upload failed');
      const { storageId } = await res.json();
      ids.push(storageId);
    }
    return ids;
  }

  const onSubmit = async (data: ReportFormData) => {
    if (data.website) return;
    setSubmitting(true);
    setUploadError(null);
    try {
      let mediaIds: Id<'_storage'>[] | undefined;
      if (imageFiles.length > 0 || videoFile) {
        try {
          mediaIds = await uploadFiles();
        } catch {
          setUploadError('File upload failed. You can submit without media.');
          setSubmitting(false);
          return;
        }
      }
      const reportId = await createReport({
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        county: data.location?.trim() || undefined,
        anonymous: data.anonymous,
        email: data.email && data.email.length > 0 ? data.email : undefined,
        mediaIds: mediaIds?.length ? mediaIds : undefined,
        source: 'web',
      });
      router.push(`/${locale}/report/success?id=${reportId}`);
    } catch {
      setSubmitting(false);
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid: File[] = [];
    for (const f of files) {
      if (f.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) continue;
      if (!f.type.startsWith('image/')) continue;
      if (valid.length >= MAX_IMAGES) break;
      valid.push(f);
    }
    setImageFiles((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
  };

  const onVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setVideoFile(null);
      return;
    }
    if (f.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) return;
    if (!f.type.startsWith('video/')) return;
    setVideoFile(f);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div>
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Report Campaign Finance Misuse
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Your identity will not be stored or shared if you choose to report
          anonymously.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input id="website" type="text" {...register('website')} tabIndex={-1} autoComplete="off" />
          </div>

          <Card>
            <label className="block mb-2 font-medium">
              Title <span className="text-[var(--accent-2)]">*</span>
            </label>
            <input
              {...register('title')}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-1)] outline-none"
              placeholder="Brief title for the report"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-[var(--accent-2)]">{errors.title.message}</p>
            )}
          </Card>

          <Card>
            <label className="block mb-2 font-medium">
              Category <span className="text-[var(--accent-2)]">*</span>
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-1)] outline-none"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Card>

          <Card>
            <label className="block mb-2 font-medium">
              Description <span className="text-[var(--accent-2)]">*</span>
            </label>
            <textarea
              {...register('description')}
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-1)] outline-none resize-y"
              placeholder="Describe what you observed..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-[var(--accent-2)]">{errors.description.message}</p>
            )}
          </Card>

          <Card>
            <label className="block mb-2 font-medium">
              Location <span className="text-[var(--accent-2)]">*</span>
            </label>
            <input
              {...register('location')}
              className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-1)] outline-none"
              placeholder="County, constituency, or town"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-[var(--accent-2)]">{errors.location.message}</p>
            )}
          </Card>

          <Card>
            <label className="block mb-2 font-medium">Photos (optional, max {MAX_IMAGES})</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onImageChange}
              className="w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[var(--accent-1)] file:text-white"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Max {MAX_IMAGE_SIZE_MB} MB per image.
            </p>
            {imageFiles.length > 0 && (
              <ul className="mt-2 text-sm">
                {imageFiles.map((f, i) => (
                  <li key={i}>{f.name}</li>
                ))}
              </ul>
            )}
          </Card>

          <Card>
            <label className="block mb-2 font-medium">Video (optional, 1 file)</label>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={onVideoChange}
              className="w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[var(--accent-1)] file:text-white"
            />
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Max {MAX_VIDEO_SIZE_MB} MB.
            </p>
            {videoFile && <p className="mt-2 text-sm">{videoFile.name}</p>}
          </Card>

          <Card>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register('anonymous')} className="w-5 h-5" />
              <span>Report anonymously</span>
            </label>
          </Card>

          {!isAnonymous && (
            <Card>
              <label className="block mb-2 font-medium">Email (optional, for follow-up)</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] focus:border-[var(--accent-1)] outline-none"
                placeholder="your@email.com"
              />
            </Card>
          )}

          {uploadError && (
            <p className="text-sm text-[var(--accent-2)]">{uploadError}</p>
          )}

          <p className="text-sm text-[var(--text-secondary)]">
            You can also report via SMS or USSD. See{' '}
            <Link href={`/${locale}/report/sms`} className="text-[var(--accent-1)] hover:underline">SMS instructions</Link>{' '}
            or{' '}
            <Link href={`/${locale}/report/ussd`} className="text-[var(--accent-1)] hover:underline">USSD instructions</Link>.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[var(--accent-1)] text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
