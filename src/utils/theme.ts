import { Theme } from '../contexts/ThemeContext';

export interface ThemePalette {
  primary: string;
  primaryHover: string;
  primaryTint: string;
  nav: string;
  navHover: string;
  navText: string;
  navActiveBg: string;
  navActiveText: string;
}

// Keep in sync with the CSS variables defined in src/index.css
export const themeColors: Record<Theme, ThemePalette> = {
  current: {
    primary: '#1D4ED8',
    primaryHover: '#1A44BC',
    primaryTint: '#EFF6FF',
    nav: '#1F2937',
    navHover: '#374151',
    navText: '#9CA3AF',
    navActiveBg: '#1D4ED8',
    navActiveText: '#FFFFFF'
  },
  client: {
    primary: '#005991',
    primaryHover: '#00456F',
    primaryTint: '#E6F4FB',
    nav: '#005991',
    navHover: '#0A6FA8',
    navText: '#D6E9F2',
    navActiveBg: '#00A3E0',
    navActiveText: '#06283D'
  }
};

export function getThemeClass(theme: Theme): string {
  return `theme-${theme}`;
}
