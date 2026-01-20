/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    safelist: [
        // Ensure turquoic classes are always generated
        {
            pattern: /bg-turquoic-(50|100|200|300|400|500|600|700|800|900)/,
        },
        {
            pattern: /text-turquoic-(50|100|200|300|400|500|600|700|800|900)/,
        },
        {
            pattern: /border-turquoic-(50|100|200|300|400|500|600|700|800|900)/,
        },
        {
            pattern: /shadow-turquoic-(50|100|200|300|400|500|600|700|800|900)/,
        },
        {
            pattern: /ring-turquoic-(50|100|200|300|400|500|600|700|800|900)/,
        },
        {
            pattern: /from-turquoic-(50|100|200|300|400|500|600|700|800|900)/,
        },
        {
            pattern: /to-turquoic-(50|100|200|300|400|500|600|700|800|900)/,
        },
        {
            pattern: /via-turquoic-(50|100|200|300|400|500|600|700|800|900)/,
        },
        // Brand-teal classes
        {
            pattern: /bg-brand-teal-(50|100|500|600|700)/,
        },
        {
            pattern: /text-brand-teal-(50|100|500|600|700)/,
        },
        {
            pattern: /border-brand-teal-(50|100|500|600|700)/,
        },
    ],
    theme: {
        extend: {
            colors: {
                turquoic: {
                    50: '#e6f9f7',
                    100: '#ccf3f0',
                    200: '#99e7e0',
                    300: '#66dbd1',
                    400: '#33cfc1',
                    500: '#30d5c8',
                    600: '#2bc0b4',
                    700: '#25a89d',
                    800: '#1e8a81',
                    900: '#176c65',
                },
                'brand-teal': {
                    50: '#E0F9FC',
                    100: '#B4F2F8',
                    500: '#00BBD1',
                    600: '#0099AB',
                    700: '#007886',
                },
                pewter: {
                    DEFAULT: '#96A1A8',
                    50: '#f7f8f9',
                    100: '#eef0f1',
                    500: '#96A1A8',
                    600: '#7a868e',
                    700: '#5e6a72',
                },
            },
            fontFamily: {
                sans: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
                mono: ['SF Mono', 'Monaco', 'Consolas', 'monospace'],
            },
            borderRadius: {
                'base': '0.375rem',
                'card': '0.5rem',
                'modal': '0.75rem',
            },
            boxShadow: {
                'turquoic': '0 0 0 3px rgba(48, 213, 200, 0.15)',
                'turquoic-strong': '0 0 20px rgba(48, 213, 200, 0.3)',
            },
        },
    },
    plugins: [],
}
