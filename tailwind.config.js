/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "rgb(184, 184, 184)",
                playbtn: "rgb(0, 185, 99)"
            }
        },
    },
    plugins: [],
};
