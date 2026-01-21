/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                clinical: {
                    blue: "#0ea5e9",
                    navy: "#1e3a8a",
                    slate: "#64748b",
                    gray: "#e2e8f0",
                    teal: "#0d9488",
                    lightTeal: "#f0fdfa",
                    textTeal: "#115e59",
                    red: "#ef4444",
                }
            }
        }
    },
    plugins: [],
}
