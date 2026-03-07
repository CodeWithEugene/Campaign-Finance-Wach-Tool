'use client';

import { useState, useEffect, useRef } from 'react';
import { Accessibility } from 'lucide-react';

const STORAGE_KEYS = {
  highContrast: 'accessibility-high-contrast',
  fontSize: 'accessibility-font-size',
  dyslexiaFont: 'accessibility-dyslexia-font',
  highlightLinks: 'accessibility-highlight-links',
  reduceMotion: 'accessibility-reduce-motion',
  voiceNarration: 'accessibility-voice-narration',
} as const;

const MAX_SPEECH_LENGTH = 300;
const TEXT_BLOCK_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li, td, th, figcaption, [role="paragraph"], blockquote';

function getSpeakableText(el: Element): string {
  if (!el || el.getAttribute('aria-hidden') === 'true') return '';
  const ariaLabel = el.getAttribute('aria-label');
  if (ariaLabel?.trim()) return ariaLabel.trim();
  const ariaLabelledby = el.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const ids = ariaLabelledby.split(/\s+/);
    const parts = ids
      .map((id) => document.getElementById(id)?.textContent?.trim())
      .filter(Boolean);
    if (parts.length) return parts.join(' ');
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    const placeholder = el.placeholder?.trim();
    const label = el.labels?.[0]?.textContent?.trim();
    const name = (el as HTMLInputElement).name;
    if (label) return label;
    if (placeholder) return placeholder;
    if (name) return name;
  }
  if (el instanceof HTMLImageElement && el.alt) return el.alt.trim();
  const raw = el.textContent?.trim().replace(/\s+/g, ' ') ?? '';
  const text = raw.length > MAX_SPEECH_LENGTH ? raw.slice(0, MAX_SPEECH_LENGTH) + '…' : raw;
  return text;
}

/** Find the nearest text block (paragraph, heading, etc.) for click-to-speak */
function getTextBlockForClick(target: Element): Element | null {
  let el: Element | null = target;
  while (el && el !== document.body) {
    if (el.matches(TEXT_BLOCK_SELECTOR)) return el;
    el = el.parentElement;
  }
  return target.closest(TEXT_BLOCK_SELECTOR) || (target.textContent?.trim() ? target : null);
}

function speak(text: string) {
  if (typeof window === 'undefined' || !text) return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  u.pitch = 1;
  synth.speak(u);
}

function getStored<T>(key: string, parse: (s: string) => T, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    return v !== null ? parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function applyPreferences(prefs: {
  highContrast: boolean;
  fontSize: number;
  dyslexiaFont: boolean;
  highlightLinks: boolean;
  reduceMotion: boolean;
  voiceNarration: boolean;
}) {
  const html = document.documentElement;
  const body = document.body;

  if (prefs.highContrast) {
    html.setAttribute('data-a11y-high-contrast', 'true');
  } else {
    html.removeAttribute('data-a11y-high-contrast');
  }

  html.style.setProperty('--a11y-font-scale', String(prefs.fontSize / 100));
  if (prefs.dyslexiaFont) {
    body.setAttribute('data-a11y-dyslexia-font', 'true');
  } else {
    body.removeAttribute('data-a11y-dyslexia-font');
  }
  if (prefs.highlightLinks) {
    body.setAttribute('data-a11y-highlight-links', 'true');
  } else {
    body.removeAttribute('data-a11y-highlight-links');
  }
  if (prefs.reduceMotion) {
    html.setAttribute('data-a11y-reduce-motion', 'true');
  } else {
    html.removeAttribute('data-a11y-reduce-motion');
  }
}

function AccessibilityButtonIcon({ className }: { className?: string }) {
  return <Accessibility className={className} size={36} aria-hidden />;
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [voiceNarration, setVoiceNarration] = useState(false);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastSpokenRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    setHighContrast(getStored(STORAGE_KEYS.highContrast, (v) => v === 'true', false));
    setFontSize(getStored(STORAGE_KEYS.fontSize, (v) => Math.min(200, Math.max(100, Number(v) || 100)), 100));
    setDyslexiaFont(getStored(STORAGE_KEYS.dyslexiaFont, (v) => v === 'true', false));
    setHighlightLinks(getStored(STORAGE_KEYS.highlightLinks, (v) => v === 'true', false));
    setReduceMotion(getStored(STORAGE_KEYS.reduceMotion, (v) => v === 'true', false));
    setVoiceNarration(getStored(STORAGE_KEYS.voiceNarration, (v) => v === 'true', false));
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const prefs = {
      highContrast,
      fontSize,
      dyslexiaFont,
      highlightLinks,
      reduceMotion,
      voiceNarration,
    };
    applyPreferences(prefs);
    setStored(STORAGE_KEYS.highContrast, String(highContrast));
    setStored(STORAGE_KEYS.fontSize, String(fontSize));
    setStored(STORAGE_KEYS.dyslexiaFont, String(dyslexiaFont));
    setStored(STORAGE_KEYS.highlightLinks, String(highlightLinks));
    setStored(STORAGE_KEYS.reduceMotion, String(reduceMotion));
    setStored(STORAGE_KEYS.voiceNarration, String(voiceNarration));
  }, [mounted, highContrast, fontSize, dyslexiaFont, highlightLinks, reduceMotion, voiceNarration]);

  /* Voice narration: speak page title on load when enabled */
  useEffect(() => {
    if (!mounted || !voiceNarration) return;
    const title = document.title || 'Campaign Finance Watch';
    speak(`${title}. Voice guidance is on. Focus any element to hear it read aloud.`);
  }, [mounted, voiceNarration]);

  /* Voice narration: speak focused element (links, buttons, inputs, and text blocks when focusable) */
  useEffect(() => {
    if (!voiceNarration) return;
    function handleFocusIn(e: FocusEvent) {
      const target = e.target as Element;
      if (!target || target.closest('[role="dialog"]')?.getAttribute('aria-label') === 'Accessibility options') return;
      const text = getSpeakableText(target);
      if (text && text !== lastSpokenRef.current) {
        lastSpokenRef.current = text;
        speak(text);
        setTimeout(() => {
          lastSpokenRef.current = null;
        }, 500);
      }
    }
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [voiceNarration]);

  /* Voice narration: click on text to speak it (paragraphs, headings, list items, etc.) */
  useEffect(() => {
    if (!voiceNarration) return;
    function handleClick(e: MouseEvent) {
      const target = e.target as Element;
      if (!target || target.closest('[role="dialog"]')?.getAttribute('aria-label') === 'Accessibility options') return;
      const block = getTextBlockForClick(target);
      if (!block) return;
      const text = getSpeakableText(block);
      if (text && text !== lastSpokenRef.current) {
        lastSpokenRef.current = text;
        speak(text);
        setTimeout(() => {
          lastSpokenRef.current = null;
        }, 500);
      }
    }
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [voiceNarration]);

  /* Voice narration: make text blocks focusable so TAB focuses and speaks them */
  useEffect(() => {
    if (!voiceNarration) return;
    const main = document.getElementById('main-content') ?? document.body;
    const blocks = main.querySelectorAll(TEXT_BLOCK_SELECTOR);
    const restorations: { el: Element; prev: string | null }[] = [];
    blocks.forEach((el) => {
      const prev = el.getAttribute('tabindex');
      restorations.push({ el, prev });
      el.setAttribute('tabindex', '0');
    });
    return () => {
      restorations.forEach(({ el, prev }) => {
        if (prev !== null) el.setAttribute('tabindex', prev);
        else el.removeAttribute('tabindex');
      });
    };
  }, [voiceNarration]);

  useEffect(() => {
    if (!open) return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    first?.focus();
    if (voiceNarration) speak('Accessibility options. Adjust high contrast, text size, and more.');
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <div className="relative">
      {/* Slide-in panel (absolute so it doesn't push the button up) */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Accessibility options"
        aria-modal="true"
        hidden={!open}
        className={`absolute right-14 bottom-0 w-[320px] max-w-[calc(100vw-3rem)] max-h-[70vh] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">Accessibility</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-2 rounded-lg hover:bg-[var(--bg-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)]"
            aria-label="Close accessibility menu"
          >
            <span className="text-xl leading-none" aria-hidden>×</span>
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(70vh-4rem)]">
          {/* High contrast */}
          <label className="flex items-center justify-between gap-3 cursor-pointer group">
            <span className="text-sm font-medium">High contrast</span>
            <button
              type="button"
              role="switch"
              aria-checked={highContrast}
              onClick={() => setHighContrast((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-[var(--border-color)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)] focus-visible:ring-offset-2 ${
                highContrast ? 'bg-[var(--accent-1)]' : 'bg-[var(--bg-primary)]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                  highContrast ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>

          {/* Font size */}
          <div>
            <label htmlFor="a11y-font-size" className="block text-sm font-medium mb-2">
              Text size: {fontSize}%
            </label>
            <input
              id="a11y-font-size"
              type="range"
              min="100"
              max="200"
              step="10"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none bg-[var(--bg-primary)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-1)] [&::-webkit-slider-thumb]:cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)]"
              aria-valuemin={100}
              aria-valuemax={200}
              aria-valuenow={fontSize}
            />
          </div>

          {/* Dyslexia font */}
          <label className="flex items-center justify-between gap-3 cursor-pointer group">
            <span className="text-sm font-medium">Dyslexia-friendly font</span>
            <button
              type="button"
              role="switch"
              aria-checked={dyslexiaFont}
              onClick={() => setDyslexiaFont((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-[var(--border-color)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)] focus-visible:ring-offset-2 ${
                dyslexiaFont ? 'bg-[var(--accent-1)]' : 'bg-[var(--bg-primary)]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                  dyslexiaFont ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>

          {/* Highlight links */}
          <label className="flex items-center justify-between gap-3 cursor-pointer group">
            <span className="text-sm font-medium">Highlight links & buttons</span>
            <button
              type="button"
              role="switch"
              aria-checked={highlightLinks}
              onClick={() => setHighlightLinks((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-[var(--border-color)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)] focus-visible:ring-offset-2 ${
                highlightLinks ? 'bg-[var(--accent-1)]' : 'bg-[var(--bg-primary)]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                  highlightLinks ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>

          {/* Reduce motion */}
          <label className="flex items-center justify-between gap-3 cursor-pointer group">
            <span className="text-sm font-medium">Stop animations</span>
            <button
              type="button"
              role="switch"
              aria-checked={reduceMotion}
              onClick={() => setReduceMotion((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-[var(--border-color)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)] focus-visible:ring-offset-2 ${
                reduceMotion ? 'bg-[var(--accent-1)]' : 'bg-[var(--bg-primary)]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                  reduceMotion ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>

          {/* Voice narration & guidance */}
          <label className="flex items-center justify-between gap-3 cursor-pointer group">
            <span className="text-sm font-medium">Voice narration & guidance</span>
            <button
              type="button"
              role="switch"
              aria-checked={voiceNarration}
              onClick={() => setVoiceNarration((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border border-[var(--border-color)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)] focus-visible:ring-offset-2 ${
                voiceNarration ? 'bg-[var(--accent-1)]' : 'bg-[var(--bg-primary)]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                  voiceNarration ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>
        </div>
      </div>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--accent-1)] shadow-lg hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-1)] focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-label={open ? 'Close accessibility options' : 'Open accessibility options'}
      >
        <AccessibilityButtonIcon className="w-9 h-9 object-contain" />
      </button>
    </div>
  );
}
