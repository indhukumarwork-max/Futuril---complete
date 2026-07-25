// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default <Config>{
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pearlSilver: 'hsl(210, 15%, 95%)',
      },
    },
  },
  plugins: [],
};
