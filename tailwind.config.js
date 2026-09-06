export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        nav: {
          DEFAULT: '#0D1117',
          hover: '#171E29',
          text: '#9CA3AF',
        },
        primary: {
          DEFAULT: '#1D4ED8',
          hover: '#1A44BC',
          tint: '#EFF6FF',
        },
        ink: '#111827',
        muted: '#6B7280',
        canvas: '#F1F3F5',
        line: '#E5E7EB',
        success: { DEFAULT: '#16A34A', tint: '#ECFDF3' },
        warning: { DEFAULT: '#F59E0B', tint: '#FFFBEB' },
        danger: { DEFAULT: '#DC2626', tint: '#FEF2F2' },
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
