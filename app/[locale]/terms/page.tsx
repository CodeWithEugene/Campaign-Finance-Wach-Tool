'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';

export default function TermsPage() {
  const pathname = usePathname();
  const locale = pathname?.split('/')[1] || 'en';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
        Terms and Conditions
      </h1>
      <p className="text-[var(--text-secondary)] mb-8">
        By signing in or signing up, you agree to these terms, including our data privacy practices.
      </p>

      <div className="space-y-6">
        <Card>
          <h2 className="font-display font-bold text-xl mb-4">
            1. Acceptance of terms
          </h2>
          <p className="text-[var(--text-secondary)]">
            By creating an account or signing in to the Campaign Finance Watch Tool (CFWT), you agree to be bound by these Terms and Conditions and our data privacy practices described below. If you do not agree, do not use the sign-in or sign-up features.
          </p>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-xl mb-4">
            2. Data privacy and personal information
          </h2>
          <p className="text-[var(--text-secondary)] mb-4">
            We are committed to protecting your privacy. When you sign up or sign in:
          </p>
          <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 mb-4">
            <li>We collect only the information necessary to operate your account (email, name if provided, and a secure password hash).</li>
            <li>We do not sell your personal data to third parties.</li>
            <li>We use your data to authenticate you, provide access to reports, map, dashboard, and related features, and to communicate with you about your account when necessary.</li>
            <li>We may retain your account data for as long as your account is active or as required by law.</li>
          </ul>
          <p className="text-[var(--text-secondary)]">
            For more detail on how we handle data across the platform (including anonymous reporting and data minimization), see our{' '}
            <Link href={`/${locale}/privacy`} className="text-[var(--accent-1)] hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-xl mb-4">
            3. Anonymous reporting
          </h2>
          <p className="text-[var(--text-secondary)]">
            You may submit reports anonymously without signing in. When you report anonymously, we do not collect your name, email, or phone number. Your identity will not be stored or shared. We cannot guarantee anonymity in all circumstances (e.g., legal subpoena). Use your judgment.
          </p>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-xl mb-4">
            4. Security and storage
          </h2>
          <p className="text-[var(--text-secondary)]">
            We use industry-standard measures to protect your account and data: passwords are hashed, we use HTTPS only, and sensitive data is stored securely. Only authorized reviewers see full report details. You are responsible for keeping your password confidential.
          </p>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-xl mb-4">
            5. Acceptable use
          </h2>
          <p className="text-[var(--text-secondary)]">
            You agree to use CFWT only for lawful purposes and in line with its mission of campaign finance transparency. You must not misuse the service, attempt to access other users&apos; data, or submit false or malicious reports.
          </p>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-xl mb-4">
            6. Changes to these terms
          </h2>
          <p className="text-[var(--text-secondary)]">
            We may update these terms from time to time. Continued use of your account after changes constitutes acceptance. We encourage you to review this page and our Privacy Policy periodically.
          </p>
        </Card>

        <Card>
          <h2 className="font-display font-bold text-xl mb-4">
            7. Contact
          </h2>
          <p className="text-[var(--text-secondary)]">
            For questions about these terms or our data privacy practices, please see our{' '}
            <Link href={`/${locale}/contact`} className="text-[var(--accent-1)] hover:underline">
              Contact
            </Link>{' '}
            page or{' '}
            <Link href={`/${locale}/privacy`} className="text-[var(--accent-1)] hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </Card>
      </div>

      <p className="mt-8 text-sm text-[var(--text-secondary)]">
        <Link href={`/${locale}`} className="text-[var(--accent-1)] hover:underline">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
