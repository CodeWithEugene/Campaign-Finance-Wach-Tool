'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [open, messages]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg: Message = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const content = data?.content ?? "I couldn't get a response. Please try again.";
      setMessages((m) => [...m, { role: 'assistant', content }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send();
  }

  return (
    <div className="relative">
      {/* Chat panel (absolute so it doesn't push the button up) */}
      <div
        role="dialog"
        aria-label="Chat"
        aria-modal="true"
        hidden={!open}
        className={`absolute right-14 bottom-0 w-[360px] max-w-[calc(100vw-3rem)] max-h-[85vh] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden transition-transform duration-300 ease-out flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between shrink-0">
          <h2 className="font-display font-bold text-lg">Chat</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-[var(--bg-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)]"
            aria-label="Close chat"
          >
            <span className="text-xl leading-none" aria-hidden>×</span>
          </button>
        </div>
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[50vh]"
        >
          {messages.length === 0 && (
            <p className="text-sm text-[var(--text-secondary)]">
              Ask about reporting misuse, Mchango, the map, dashboard, or the Learn section.
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-[var(--accent-1)] text-white'
                    : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)]'
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {msg.content.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                    j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-xl px-4 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)]">
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border-color)] shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)]"
              aria-label="Message"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2 rounded-lg bg-[var(--accent-1)] text-white text-sm font-medium disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)]"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--accent-1)] text-white shadow-lg hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)] focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
