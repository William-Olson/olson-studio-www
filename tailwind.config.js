module.exports = {
  content: ['./dist/**/*.html', './src/**/*.{js,jsx,ts,tsx}', './*.html'],
  plugins: [require('@tailwindcss/forms')],
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  darkMode: 'media',
  theme: {
    fontFamily: { sans: ['"Montserrat"'] },
    extend: {
      animation: {
        'spin-slow': 'spin 6s linear infinite',
        'ping-once': 'ping 1s cubic-bezier(0, 0, 0.2, 1) 1'
      }
    },
    colors: ({ colors }) => ({
      inherit: colors.inherit,
      current: colors.current,
      neutral: colors.neutral,
      stone: colors.stone,
      geek: 'rgb(15 26 6)',
      // light: 'rgb(240 237 227)',
      // light: 'rgb(171 170 167 / 80%)',
      dark: 'rgb(16 12 13 / 91%)',
      white: '#DBD9D4',
      black: '#1A0609',
      accent: '#711c1c',
      'accent-dark': '#490900'
    }),
    borderColor: ({ theme }) => ({
      ...theme('colors'),
      DEFAULT: theme('colors.gray.200', 'currentColor')
    }),
    animation: {
      none: 'none',
      spin: 'spin 1s linear infinite',
      ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      bounce: 'bounce 1s infinite'
    }
  }
};
