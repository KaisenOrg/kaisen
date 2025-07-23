import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyTheme: (theme?: Theme) => void;
}

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored) return stored;
  // System preference
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  return mq.matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: getPreferredTheme(),
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
    get().applyTheme(theme);
  },
  applyTheme: (theme) => {
    const t = theme || get().theme;
    const root = document.documentElement;
    if (t === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      root.classList.toggle('dark', mq.matches);
    } else {
      root.classList.toggle('dark', t === 'dark');
    }
  },
}));

// Listen for system theme changes if 'system' is selected
if (typeof window !== 'undefined') {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', () => {
    const theme = localStorage.getItem('theme') as Theme | null;
    if (theme === 'system') {
      useThemeStore.getState().applyTheme('system');
    }
  });
} 