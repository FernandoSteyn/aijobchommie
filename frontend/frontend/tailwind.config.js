/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00ffff',
        'neon-pink': '#ff00ff',
        'neon-green': '#00ff00',
        'neon-blue': '#0099ff',
        'neon-purple': '#9900ff',
        'neon-orange': '#ff9900',
        'neon-red': '#ff0066',
        'neon-yellow': '#ffff00',
        'gold-400': '#fbbf24',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'tech': ['Share Tech Mono', 'monospace'],
      },
      animation: {
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'background-pulse': 'backgroundPulse 10s ease-in-out infinite',
        'slideUp': 'slideUp 0.5s ease-out',
        'slideLeft': 'slideLeft 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        neonPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff',
          },
          '50%': {
            boxShadow: '0 0 30px #00ffff, 0 0 60px #00ffff',
          }
        },
        backgroundPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      backdropBlur: {
        'xs': '2px'
      },
      boxShadow: {
        'neon': '0 0 20px currentColor',
        'neon-lg': '0 0 40px currentColor',
        'neon-xl': '0 0 60px currentColor',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
