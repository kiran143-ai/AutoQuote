import React, { createContext, useContext, useState } from 'react';

export type Theme = 'current' | 'client';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('current');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'current' ? 'client' : 'current') }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
