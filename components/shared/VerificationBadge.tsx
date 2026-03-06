import { CheckCircle, Clock, HelpCircle } from 'lucide-react';

type Status = 'verified' | 'under_review' | 'unverified';

interface VerificationBadgeProps {
  status: Status;
}

export function VerificationBadge({ status }: VerificationBadgeProps) {
  const config = {
    verified: {
      icon: CheckCircle,
      label: 'Verified',
      className: 'bg-green-500/20 text-green-600 dark:text-green-400',
    },
    under_review: {
      icon: Clock,
      label: 'Under review',
      className: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    },
    unverified: {
      icon: HelpCircle,
      label: 'Unverified',
      className: 'bg-gray-500/20 text-gray-600 dark:text-gray-400',
    },
  };

  const { icon: Icon, label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${className}`}
      title={status === 'verified' ? 'Verified via cross-reference' : ''}
    >
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
}
