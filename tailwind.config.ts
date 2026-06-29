import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0b7d8e',
          dark:    '#096570',
          light:   '#13a0b5',
          50:      '#f0fafb',
          100:     '#e0f5f8',
          200:     '#b3e8f0',
          foreground: '#ffffff',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted:   '#f7fbfc',
        },
      },
      boxShadow: {
        card:         '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(11,125,142,0.07)',
        'card-hover': '0 4px 8px rgba(0,0,0,0.06), 0 12px 32px rgba(11,125,142,0.13)',
        'card-sm':    '0 1px 2px rgba(0,0,0,0.04), 0 2px 8px rgba(11,125,142,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
