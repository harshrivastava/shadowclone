/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{ts,tsx}",
        "./electron/**/*.{ts,tsx}"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                border: "rgba(255, 255, 255, 0.1)",
                background: "#030014", // Deep void purple/black
                surface: "#0f0728",
                primary: "#7c3aed", // Violet
                secondary: "#06b6d4", // Cyan
                accent: "#f472b6", // Pink
                foreground: "#e2e8f0",
            },
            fontFamily: {
                display: ["Outfit", "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
            backgroundImage: {
                'gradient-glow': 'conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a855f7 180deg, #2a8af6 360deg)',
                'metallic-text': 'linear-gradient(to bottom, #ffffff 40%, #94a3b8 100%)',
                'glass-surface': 'linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.0) 100%)',
            },
            boxShadow: {
                'glow': '0 0 40px -10px rgba(124, 58, 237, 0.5)',
                'inner-glow': 'inset 0 0 20px rgba(255, 255, 255, 0.05)',
            },
            animation: {
                'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        },
    },
    plugins: [],
}
