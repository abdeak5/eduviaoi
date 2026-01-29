import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}", // Handle both src/app and app/
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                win: {
                    gray: "#C0C0C0", // Classic Windows Gray
                    "gray-light": "#DFDFDF",
                    "gray-dark": "#808080",
                    "gray-darker": "#404040",
                    blue: "#000080", // Title Bar Blue
                    "blue-light": "#1084d0", // Active Gradient Start
                    white: "#FFFFFF",
                    black: "#000000",
                    teal: "#008080", // Classic Desktop Background
                },
            },
            boxShadow: {
                'win-out': 'inset 1px 1px #dfdfdf, inset -1px -1px #808080, inset 2px 2px #ffffff, inset -2px -2px #404040',
                'win-in': 'inset 1px 1px #404040, inset -1px -1px #ffffff, inset 2px 2px #808080, inset -2px -2px #dfdfdf',
                'win-flat': 'inset 1px 1px #ffffff, inset -1px -1px #404040',
                'win-pressed': 'inset 1px 1px #000000, inset -1px -1px #ffffff, inset 2px 2px #808080, inset -2px -2px #dfdfdf',
            },
            fontFamily: {
                sans: ['"MS Sans Serif"', '"Segoe UI"', 'sans-serif'], // Fallback chain
                mono: ['"Courier New"', 'monospace'],
            },
            backgroundImage: {
                'win-gradient': 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
            }
        },
    },
    plugins: [],
};
export default config;
