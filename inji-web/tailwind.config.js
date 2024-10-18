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
            colors: {
                iw: {
                    background: 'var(--iw-color-background)',
                    header: 'var(--iw-color-header)',
                    footer: 'var(--iw-color-footer)',
                    title: 'var(--iw-color-title)',
                    subTitle: 'var(--iw-color-subTitle)',
                    searchTitle: 'var(--iw-color-searchTitle)',
                    primary: 'var(--iw-color-primary)',
                    secondary:'var(--iw-color-secondary)',
                    tertiary:'var(--iw-color-tertiary)',
                    lightPrimary: 'var(--iw-color-lightPrimary)',
                    lightSecondary:'var(--iw-color-lightSecondary)',
                    helpAccordionHover: 'var(--iw-color-helpAccordionHover)',
                    shadow: 'var(--iw-color-shadow)',
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
                }
            }
        },
    },
    plugins: [require('tailwindcss-rtl')],
}
