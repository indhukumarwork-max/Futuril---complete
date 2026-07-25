// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default <Config>{
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pearlSilver: 'hsl(210, 15%, 95%)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        surface2: 'var(--color-surface-2)',
        border: 'var(--color-border)',
        ink: 'var(--color-ink)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        accentTint: 'var(--color-accent-tint)',
      },
    },
  },
  plugins: [],
};
