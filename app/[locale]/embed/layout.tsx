export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[var(--bg-primary)]">{children}</div>;
}
