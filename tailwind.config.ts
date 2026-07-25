import type { Config } from 'tailwindcss';

export default <Config>{
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        surface2: 'var(--color-surface-2)',
        border: {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
        },
        ink: {
          DEFAULT: 'var(--color-ink)',
          secondary: 'var(--color-secondary)',
          onAccent: 'var(--color-ink-on-accent)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary-bg)',
          hover: 'var(--color-secondary-hover)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          subtle: 'var(--color-accent-subtle)',
          border: 'var(--color-accent-border)',
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          bg: 'var(--color-destructive-bg)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          bg: 'var(--color-success-bg)',
        },
      },
    },
  },
  plugins: [],
};
