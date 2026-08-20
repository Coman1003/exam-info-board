/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        pink: 'var(--color-pink)',
        mint: 'var(--color-mint)',
        sky: 'var(--color-sky)',
        lavender: 'var(--color-lavender)',
        'light-bg': 'var(--color-light-bg)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        'text-light': 'var(--color-text-light)'
      },
      boxShadow: {
        soft: '0 8px 20px rgba(0, 0, 0, 0.06)'
      }
    }
  },
  plugins: []
};
