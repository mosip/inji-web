const GRADIENT_PRIMARY = "linear-gradient(90deg,_#FF5300_0%,_#FB5103_16%,_#F04C0F_31%,_#DE4322_46%,_#C5363C_61%,_#A4265F_75%,_#7C1389_90%,_#5B03AD_100%)";

export const CredentialRequestModalStyles = {
    header: {
        container: "flex flex-col justify-center px-6 py-4 border-b !border-[var(--iw-color-borderLight)]",
        title: "mb-2 font-montserrat font-semibold text-lg leading-7 !text-[var(--iw-color-title)]",
        description: "font-montserrat font-normal text-sm leading-5 !text-[var(--iw-color-subTitle)]"
    },
    content: {
        container: "overflow-y-auto py-3 px-6 flex-1",
        loadingContainer: "flex items-center justify-center py-6",
        credentialsList: "space-y-2",
        credentialItemWrapper: "w-full transition-colors",
        credentialItem: "w-full rounded-lg flex items-center justify-between transition-colors !bg-[var(--iw-color-tileBackground)] !border-[var(--iw-color-borderLight)] hover:!bg-[var(--iw-color-faqAccordionHover)] p-3 shadow-md",
        credentialItemSelected: "w-full rounded-lg flex items-center justify-between transition-colors opacity-90 p-3",
        credentialContent: "flex items-center space-x-3 min-w-0 flex-1",
        credentialImage: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden",
        credentialInfo: "min-w-0 flex-1",
        credentialName: "font-montserrat font-semibold text-base leading-none !text-[var(--iw-color-title)] truncate",
        checkboxContainer: "flex-shrink-0 relative flex items-center justify-center ml-2",
        checkbox: "rounded focus:ring-2 focus:!ring-[var(--iw-color-primary)] w-5 h-5",
        checkboxIcon: "w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
        credentialItemSelectedWrapper: "w-full transition-colors shadow-md",
        credentialItemSelectedBackground: `!bg-[${GRADIENT_PRIMARY}]`,
        checkboxSelected: `rounded focus:ring-2 focus:!ring-[var(--iw-color-primary)] w-5 h-5 !bg-[${GRADIENT_PRIMARY}]`
    },
    footer: {
        container: "px-6 py-4 border-t !border-[var(--iw-color-borderLight)]",
        mobileLayout: "flex flex-col gap-3 sm:hidden",
        desktopLayout: "hidden sm:flex justify-end items-center gap-3",
        cancelButton: "transition-all relative w-full h-10 min-h-[40px] sm:w-36 sm:h-12 sm:min-h-[48px] text-base text-center border-none !bg-[var(--iw-color-tileBackground)] p-0",
        consentButton: "rounded-lg transition-all w-full h-10 min-h-[40px] sm:w-44 sm:h-12 sm:min-h-[48px] text-center border-none p-0 font-montserrat font-bold text-base leading-4",
        consentButtonEnabled: `hover:opacity-90 text-white !bg-[${GRADIENT_PRIMARY}]`,
        consentButtonDisabled: "cursor-not-allowed text-white !bg-[var(--iw-color-grayLight)]",
        cancelButtonContainer: `relative rounded-lg p-0.5 !bg-[${GRADIENT_PRIMARY}]`,
        cancelButtonText: `font-montserrat font-bold text-base leading-4 text-center inline-block whitespace-nowrap overflow-visible p-0.5 m-0 w-auto min-w-fit !bg-[${GRADIENT_PRIMARY}] !bg-clip-text !text-transparent`
    }
};
