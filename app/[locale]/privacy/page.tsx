'use client';

import { Card } from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Privacy Policy
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          Whistleblower protection and data handling
        </p>

        <div className="space-y-6">
          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Anonymous Reporting
            </h2>
            <p className="text-[var(--text-secondary)]">
              When you report anonymously, we do not collect your name, email,
              or phone number. Your identity will not be stored or shared. We
              cannot guarantee anonymity in all circumstances (e.g., legal
              subpoena). Use your judgment.
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Data Minimization
            </h2>
            <p className="text-[var(--text-secondary)]">
              We strip EXIF metadata from uploaded images. Optional contact
              info is auto-deleted after 90 days if no follow-up. We do not log
              user agents beyond generic mobile/desktop for rate limiting.
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Secure Storage
            </h2>
            <p className="text-[var(--text-secondary)]">
              Sensitive fields are encrypted at rest. We use HTTPS only. Only
              verified reviewers see full report details.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
