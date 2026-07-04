import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary:      'var(--primary-color)',
        accent:       'var(--accent-color)',
        'on-primary': 'var(--on-primary)',
        surface:      'var(--surface-color)',
        ink:          'var(--text-color)',
        muted:        'var(--text-muted)',
        line:         'var(--border-color)',
        error:        'var(--error-color)',
        success:      'var(--success-color)',
        warning:      'var(--warning-color)',
        info:         'var(--info-color)',
      },
      fontFamily: { sans: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}

export default config