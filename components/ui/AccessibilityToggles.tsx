'use client';

import { useEffect, useState } from 'react';

const STORAGE_HIGH_CONTRAST = 'cfw-high-contrast';
const STORAGE_SIMPLE_LANG = 'cfw-simple-language';

export function AccessibilityToggles() {
  const [highContrast, setHighContrast] = useState(false);
  const [simpleLanguage, setSimpleLanguage] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const hc = localStorage.getItem(STORAGE_HIGH_CONTRAST) === 'true';
    const sl = localStorage.getItem(STORAGE_SIMPLE_LANG) === 'true';
    setHighContrast(hc);
    setSimpleLanguage(sl);
    const html = document.documentElement;
    if (hc) html.setAttribute('data-high-contrast', 'true');
    else html.removeAttribute('data-high-contrast');
    if (sl) html.setAttribute('data-simple-language', 'true');
    else html.removeAttribute('data-simple-language');
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    if (highContrast) {
      html.setAttribute('data-high-contrast', 'true');
      localStorage.setItem(STORAGE_HIGH_CONTRAST, 'true');
    } else {
      html.removeAttribute('data-high-contrast');
      localStorage.setItem(STORAGE_HIGH_CONTRAST, 'false');
    }
  }, [highContrast, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const html = document.documentElement;
    if (simpleLanguage) {
      html.setAttribute('data-simple-language', 'true');
      localStorage.setItem(STORAGE_SIMPLE_LANG, 'true');
    } else {
      html.removeAttribute('data-simple-language');
      localStorage.setItem(STORAGE_SIMPLE_LANG, 'false');
    }
  }, [simpleLanguage, mounted]);

  if (!mounted) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={highContrast}
          onChange={(e) => setHighContrast(e.target.checked)}
          className="w-4 h-4"
        />
        <span>High contrast</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={simpleLanguage}
          onChange={(e) => setSimpleLanguage(e.target.checked)}
          className="w-4 h-4"
        />
        <span>Simple language</span>
      </label>
    </div>
  );
}
