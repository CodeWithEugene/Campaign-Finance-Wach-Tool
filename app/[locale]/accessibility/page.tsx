'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export default function AccessibilityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
       
       
      >
        <h1 className="font-display font-black text-3xl lg:text-4xl mb-2">
          Accessibility
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">
          We are committed to making Campaign Finance Watch Tool accessible to
          all users.
        </p>

        <div className="space-y-6">
          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Screen Reader Support
            </h2>
            <p className="text-[var(--text-secondary)]">
              We use semantic HTML (nav, main, article, section), ARIA labels
              for interactive elements, and skip links. All images have alt
              text.
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Keyboard Navigation
            </h2>
            <p className="text-[var(--text-secondary)]">
              All interactive elements are focusable via Tab. Escape closes
              modals. We maintain a logical tab order and visible focus
              indicators.
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Visual Accessibility
            </h2>
            <p className="text-[var(--text-secondary)] mb-4">
              Dark and light mode support. Resizable text up to 200%. Color is
              not the sole indicator — we use icons and labels. Minimum touch
              target 44x44px on mobile.
            </p>
            <p className="text-[var(--text-secondary)]">
              Use the theme toggle in the header to switch between light and
              dark mode.
            </p>
          </Card>

          <Card>
            <h2 className="font-display font-bold text-xl mb-4">
              Reduced Motion
            </h2>
            <p className="text-[var(--text-secondary)]">
              We respect prefers-reduced-motion. When enabled, animations are
              disabled.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
