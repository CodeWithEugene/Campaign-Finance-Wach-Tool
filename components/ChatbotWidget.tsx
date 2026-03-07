'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Mic, MicOff, Volume2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getSpeechLang, getVoiceForLang } from '@/lib/speechLocale';

type Message = { role: 'user' | 'assistant'; content: string };

/** Browser Speech Recognition is not in TS lib; type the shape we use. */
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: { resultIndex: number; results: { isFinal: boolean; [0]: { transcript: string } }[] }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructorLike;
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike;
  }
}

function getSpeechRecognition(): SpeechRecognitionConstructorLike | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

/** Plain text for TTS (strip markdown bold). */
function stripMarkdownForSpeech(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '$1').trim();
}

export function ChatbotWidget() {
  const pathname = usePathname();
  const locale = (pathname?.split('/')[1] as string) || 'en';
  const speechLang = getSpeechLang(locale);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastInputWasVoice, setLastInputWasVoice] = useState(false);
  const [voicesReady, setVoicesReady] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop(): void } | null>(null);
  const voiceTranscriptRef = useRef('');
  const inputFromVoiceRef = useRef(false);

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

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const v = window.speechSynthesis.getVoices();
        if (v.length > 0) setVoicesReady(true);
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const plain = stripMarkdownForSpeech(text);
      if (!plain) return;
      const u = new SpeechSynthesisUtterance(plain);
      u.lang = speechLang;
      const voice = getVoiceForLang(speechLang);
      if (voice) u.voice = voice;
      u.rate = 0.95;
      u.onstart = () => setIsSpeaking(true);
      u.onend = u.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(u);
    },
    [speechLang]
  );

  const send = useCallback(
    async (textOverride?: string) => {
      const text = (textOverride ?? input).trim();
      if (!text || loading) return;
      setInput('');
      const userMsg: Message = { role: 'user', content: text };
      setMessages((m) => [...m, userMsg]);
      setLoading(true);
      setLastInputWasVoice(!!textOverride);
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
        const shouldSpeak = textOverride || inputFromVoiceRef.current;
        if (inputFromVoiceRef.current) inputFromVoiceRef.current = false;
        if (shouldSpeak && typeof window !== 'undefined' && window.speechSynthesis) {
          setTimeout(() => speak(content), 300);
        }
      } catch {
        setMessages((m) => [...m, { role: 'assistant', content: "Something went wrong. Please try again." }]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, speak]
  );

  const startListening = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Voice input is not supported in this browser. Try Chrome or Edge.' }]);
      return;
    }
    if (isListening) return;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = speechLang;
    recognitionRef.current = recognition;

    recognition.onresult = (e) => {
      let final = '';
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        if (e.results[i].isFinal) {
          final += transcript;
          voiceTranscriptRef.current += (voiceTranscriptRef.current ? ' ' : '') + transcript;
        } else {
          interim += transcript;
        }
      }
      if (final) setInput((prev) => (prev ? prev + ' ' + final : final));
      else if (interim) setInput((prev) => (prev ? prev + ' ' + interim : interim));
    };
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      const text = voiceTranscriptRef.current.trim();
      voiceTranscriptRef.current = '';
      if (text) {
        setInput(text);
        inputFromVoiceRef.current = true;
      }
    };
    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    voiceTranscriptRef.current = '';
    recognition.start();
    setIsListening(true);
  }, [speechLang, isListening]);

  const stopListening = useCallback(() => {
    const r = recognitionRef.current;
    if (r) {
      try {
        r.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send();
  }

  const hasSpeechRecognition = typeof window !== 'undefined' && !!getSpeechRecognition();

  return (
    <div className="relative">
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
              Ask about the project, hackathon (TI-Kenya, iLab Africa), reporting, Mchango, map, dashboard, Learn (PPF, limits), or anything else on the platform. Use the mic to ask in your language.
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
                {msg.role === 'assistant' && (
                  <button
                    type="button"
                    onClick={() => speak(msg.content)}
                    disabled={isSpeaking}
                    className="mt-2 flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--accent-1)] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)] rounded px-1"
                    aria-label="Play answer in voice"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
                )}
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
        <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--border-color)] shrink-0 space-y-2">
          <div className="flex gap-2">
            {hasSpeechRecognition && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`shrink-0 p-2.5 rounded-lg border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)] ${
                  isListening
                    ? 'bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300'
                    : 'border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Ask by voice'}
                title={isListening ? 'Stop' : `Voice input (${speechLang})`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={hasSpeechRecognition ? 'Type or use mic...' : 'Type a message...'}
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
          {hasSpeechRecognition && (
            <p className="text-xs text-[var(--text-secondary)]">
              Voice uses your current page language ({speechLang}). Answer will be read aloud when you use the mic.
            </p>
          )}
        </form>
      </div>

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
