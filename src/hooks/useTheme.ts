import { useEffect, useState } from 'react';
import type { ReaderTheme } from '../types';

const STORAGE_KEY = 'reader:theme';

function readInitialTheme(): ReaderTheme {
  const stored = localStorage.getItem(STORAGE_KEY);
  switch (stored) {
    case 'light':
    case 'sepia':
    case 'dark':
      return stored;
    default:
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<ReaderTheme>(readInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme };
}
