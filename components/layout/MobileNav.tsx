'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileNavProps {
  links: { href: string; label: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ links, isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <nav
      className="lg:hidden absolute top-full left-0 right-0 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shadow-lg"
      aria-label="Mobile navigation"
    >
      <ul className="py-4 px-4 flex flex-col gap-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onClose}
              className={`block px-4 py-3 rounded-lg min-h-[44px] flex items-center font-medium ${
                pathname?.startsWith(link.href)
                  ? 'bg-[var(--accent-1)]/10 text-[var(--accent-1)]'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
