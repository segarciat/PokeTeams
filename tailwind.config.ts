import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e64545',
        // Pokemon types.
        normal: '#a8a878',
        fire: '#f08030',
        fighting: '#c03028',
        water: '#6890f0',
        flying: '#a890f0',
        grass: '#78c850',
        poison: '#a040a0',
        electric: '#f8d030',
        ground: '#e0c068',
        psychic: '#f85888',
        rock: '#b8a038',
        ice: '#98d8d8',
        bug: '#a8b820',
        dragon: '#7038f8',
        ghost: '#705898',
        dark: '#705848',
        steel: '#b8b8d0',
        fairy: '#ee99ac'
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' }
        }
      },
      animation: {
        slideIn: 'slideIn 0.2s ease-in-out forwards'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: []
}
export default config
