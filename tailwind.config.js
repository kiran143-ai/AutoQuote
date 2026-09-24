export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        nav: {
          DEFAULT: 'var(--color-nav)',
          hover: 'var(--color-nav-hover)',
          text: 'var(--color-nav-text)',
        },
        navActive: {
          DEFAULT: 'var(--color-nav-active-bg)',
          text: 'var(--color-nav-active-text)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          tint: 'var(--color-primary-tint)',
        },
        ink: '#111827',
        muted: '#6B7280',
        canvas: '#F1F3F5',
        line: '#E5E7EB',
        success: { DEFAULT: '#28A745', tint: '#F2FAF4' },
        warning: { DEFAULT: '#F0A500', tint: '#FEFAF0' },
        danger: { DEFAULT: '#DC3545', tint: '#FDF3F4' },
        info: { DEFAULT: '#0EA5E9', tint: '#EFF6FF' },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        micro: ['11px', '16px'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)',
        pop: '0 8px 24px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
}
