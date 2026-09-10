import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sentina/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#030004',
        foreground: '#f8fafc',
        card: '#060108',
        'card-hover': '#0b020e',
        'card-elevated': '#0e0212',
        border: '#360a25',
        'border-subtle': '#28081c',
        primary: '#ff1744',
        'primary-hover': '#e11d48',
        'primary-dark': '#880815',
        secondary: '#a1a1aa',
        muted: '#71717a',
        accent: '#00f2fe',
        'accent-cyan': '#00f2fe',
        'accent-purple': '#c084fc',
        'accent-emerald': '#00ff88',
        'accent-amber': '#fbbf24',
        danger: '#ff1744',
        warning: '#f59e0b',
        success: '#00ff88',
        'glow-primary': 'rgba(255, 23, 68, 0.6)',
        'glow-red': 'rgba(255, 23, 68, 0.6)',
        'glow-cyan': 'rgba(0, 242, 254, 0.6)',
        'glow-green': 'rgba(0, 255, 136, 0.6)',
        'glow-purple': 'rgba(192, 132, 252, 0.6)',
        'glow-orange': 'rgba(255, 87, 34, 0.6)',
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 23, 68, 0.6)',
        'glow-red': '0 0 22px rgba(255, 23, 68, 0.7)',
        'glow-strong': '0 0 30px rgba(255, 23, 68, 0.85)',
        'glow-cyan': '0 0 20px rgba(0, 242, 254, 0.6)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.6)',
        'glow-purple': '0 0 20px rgba(192, 132, 252, 0.6)',
        'glow-orange': '0 0 20px rgba(255, 87, 34, 0.6)',
        'glow-intense': '0 0 24px rgba(255, 23, 68, 0.85), 0 0 45px rgba(225, 29, 72, 0.5)',
        'glow-text': '0 0 10px rgba(255, 23, 68, 0.6)',
        cyber: '0 8px 32px 0 rgba(0, 0, 0, 0.95), 0 0 14px rgba(255, 23, 68, 0.15)',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-red': 'pulseRedGlow 2.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-fast': 'spinClockwise 7s linear infinite',
        'spin-medium': 'spinClockwise 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        spinClockwise: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        pulseRedGlow: {
          '0%, 100%': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.95), 0 0 25px rgba(255, 23, 68, 0.65)',
          },
          '50%': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.95), 0 0 45px rgba(255, 23, 68, 0.95)',
          },
        },
      },
    },
  },
  plugins: [],
}

export default config
