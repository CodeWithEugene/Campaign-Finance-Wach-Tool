'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

const reportSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.enum(['vote-buying', 'illegal-donations', 'misuse-public-resources', 'undeclared-spending', 'bribery', 'other']),
  location: z.string().min(2, 'Location is required'),
  anonymous: z.boolean().default(false),
  email: z.string().email().optional().or(z.literal('')),
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

export default function ReportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: { anonymous: false },
  });

  const isAnonymous = watch('anonymous');

  const onSubmit = async (data: ReportFormData) => {
    setSubmitting(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise((r) => setTimeout(r, 1000));
      const reportId = 'RPT-' + Date.now();
      router.push(`/${locale}/report/success?id=${reportId}`);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Report Campaign Finance Misuse
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Your identity will not be stored or shared if you choose to report
          anonymously.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <p className="mt-1 text-sm text-[var(--accent-2)]">
                {errors.title.message}
              </p>
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
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
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
              <p className="mt-1 text-sm text-[var(--accent-2)]">
                {errors.description.message}
              </p>
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
              <p className="mt-1 text-sm text-[var(--accent-2)]">
                {errors.location.message}
              </p>
            )}
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

          <p className="text-sm text-[var(--text-secondary)]">
            You can also report via SMS or USSD. See{' '}
            <Link href={`/${locale}/report/sms`} className="text-[var(--accent-1)] hover:underline">
              SMS instructions
            </Link>{' '}
            or{' '}
            <Link href={`/${locale}/report/ussd`} className="text-[var(--accent-1)] hover:underline">
              USSD instructions
            </Link>
            .
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
