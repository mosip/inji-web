/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'selector',
    content: [
        "./src/**/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily:{
                base: 'var(--iw-font-base)',
            },
            zIndex: {
                '50': '50',
                '40': '40',
                '30': '30'
            },
            colors: {
                iw: {
                    background: 'var(--iw-color-background)',
                    header: 'var(--iw-color-header)',
                    footer: 'var(--iw-color-footer)',
                    title: 'var(--iw-color-title)',
                    subTitle: 'var(--iw-color-subTitle)',
                    searchTitle: 'var(--iw-color-searchTitle)',
                    primary: 'var(--iw-color-primary)',
                    helpAccordionHover: 'var(--iw-color-helpAccordionHover)',
                    shadow: 'var(--iw-color-shadow)',
                    selectedShadow: 'var(--iw-color-selected-shadow)',
                    spinningLoaderPrimary: 'var(--iw-color-spinningLoaderPrimary)',
                    spinningLoaderSecondary: 'var(--iw-color-spinningLoaderSecondary)',
                    navigationBar: 'var(--iw-color-navigationBar)',
                    languageGlobeIcon: 'var(--iw-color-languageGlobeIcon)',
                    languageArrowIcon: 'var(--iw-color-languageArrowIcon)',
                    languageCheckIcon: 'var(--iw-color-languageCheckIcon)',
                    closeIcon: 'var(--iw-color-closeIcon)',
                    searchIcon: 'var(--iw-color-searchIcon)',
                    tileBackground: 'var(--iw-color-tileBackground)',
                    shieldSuccessIcon: 'var(--iw-color-shieldSuccessIcon)',
                    shieldErrorIcon: 'var(--iw-color-shieldErrorIcon)',
                    shieldLoadingIcon: 'var(--iw-color-shieldLoadingIcon)',
                    shieldSuccessShadow: 'var(--iw-color-shieldSuccessShadow)',
                    shieldErrorShadow: 'var(--iw-color-shieldErrorShadow)',
                    shieldLoadingShadow: 'var(--iw-color-shieldLoadingShadow)',
                    backDrop: 'var(--iw-color-backDrop)',
                    borderLight: 'var(--iw-color-borderLight)',
                    borderDark: 'var(--iw-color-borderDark)',
                    arrowDown: 'var(--iw-color-arrowDown)',
                    hoverBackGround: 'var(--iw-color-hoverBackGround)',
                    text: 'var(--iw-color-text)',
                    subText: 'var(--iw-color-subText)',
                    disclaimerBackGround: 'var(--iw-color-disclaimerBackGround)',
                    disclaimerText: 'var(--iw-color-disclaimerText)'
                }
            }
        },
    },
    plugins: [require('tailwindcss-rtl')],
}
