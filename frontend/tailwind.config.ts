// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',  // Adjust for your setup
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
