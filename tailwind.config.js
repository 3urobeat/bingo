/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                playbtn: "rgb(0, 185, 99)",
                footerColor: "rgb(102, 102, 102)"
            }
        },
    },
    plugins: [],
};
