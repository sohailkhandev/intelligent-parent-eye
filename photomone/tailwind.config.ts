import type { Config } from 'tailwindcss'

export default {
  important: true,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        app: '#ffffff',
      },
      fontFamily: {
        sans: ['"Proxima Nova"', 'Poppins', 'sans-serif'],
        proxima: ['"Proxima Nova"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        sm: '0.9em',
      },
    },
  },
} satisfies Config

