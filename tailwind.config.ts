import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de marca (espejo de app_theme.dart)
        cream: '#FAF7F2',
        plum: '#453A5F',
        plumDeep: '#332B45',
        coral: '#EE8B8F',
        coralAction: '#C24D5C',
        lilac: '#8C7BAE',
        lilacSoft: '#EFEAF6',
        sage: '#3E6B4F',
        sageSoft: '#E7F0E9',
        gold: '#B98A2F',
        goldSoft: '#FBF3E1',
        ink: '#262522',
        night: '#1F1929',
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
