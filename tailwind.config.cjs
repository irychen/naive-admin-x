/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
    darkMode: 'class', // or 'media' or 'class'
    theme: {
        extend: {},
        screens: {
            '2xl': { max: '1535px' },
            // => @media (max-width: 1535px) { ... }
            xl: { max: '1279px' },
            // => @media (max-width: 1279px) { ... }
            lg: { max: '1023px' },
            // => @media (max-width: 1023px) { ... }
            md: { max: '767px' },
            // => @media (max-width: 767px) { ... }
            sm: { max: '680px' },
            // => @media (max-width: 680px) { ... }
            xs: { max: '580px' },
            // => @media (max-width: 580px) { ... }
            ss: { max: '420px' },
            // => @media (max-width: 420px) { ... }
            es: { max: '320px' },
            // => @media (max-width: 320px) { ... }
        },
    },
    plugins: [],
};
