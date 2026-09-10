import { Theme } from '../contexts/ThemeContext';

export const themeColors: Record<Theme, {primary: string;nav: string;navHover: string;}> = {
  current: {
    primary: '#2563EB',
    nav: '#1F2937',
    navHover: '#374151'
  },
  client: {
    primary: '#0079C2',
    nav: '#003D7A',
    navHover: '#004A94'
  }
};

export function getThemeClass(theme: Theme): string {
  return `theme-${theme}`;
}
