export const CredentialRequestModalStyles = {
    header: {
        container: "flex flex-col justify-center px-6 py-4 border-b border-gray-200",
        title: "mb-2 font-montserrat font-semibold text-lg leading-7 text-gray-900",
        description: "font-montserrat font-normal text-sm leading-5 text-gray-600"
    },
    content: {
        container: "overflow-y-auto py-3 px-6 flex-1 max-h-[200px]",
        loadingContainer: "flex items-center justify-center py-6",
        credentialsList: "space-y-4",
        credentialItemWrapper: "w-full h-[78px] transition-colors",
        credentialItem: "w-full h-[78px] rounded-lg flex items-center justify-between transition-colors bg-white border border-gray-200 hover:bg-gray-50 p-3",
        credentialItemSelected: "w-full rounded-lg flex items-center justify-between transition-colors opacity-90 p-3",
        credentialContent: "flex items-center space-x-3 min-w-0 flex-1",
        credentialImage: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden",
        credentialInfo: "min-w-0 flex-1",
        credentialName: "font-montserrat font-semibold text-base leading-none text-gray-900 truncate",
        checkboxContainer: "flex-shrink-0 relative flex items-center justify-center ml-2",
        checkbox: "rounded focus:ring-2 focus:ring-orange-500 w-5 h-5",
        checkboxIcon: "w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    },
    footer: {
        container: "px-6 py-4 border-t border-gray-200",
        mobileLayout: "flex flex-col gap-3 sm:hidden",
        desktopLayout: "hidden sm:flex justify-end items-center gap-3",
        cancelButton: "transition-all relative w-full h-10 min-h-[40px] sm:w-36 sm:h-12 sm:min-h-[48px] text-base text-center border-none bg-white p-0",
        consentButton: "rounded-lg transition-all w-full h-10 min-h-[40px] sm:w-44 sm:h-12 sm:min-h-[48px] text-center border-none p-0 font-montserrat font-bold text-base leading-4",
        consentButtonEnabled: "hover:opacity-90 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-white",
        consentButtonDisabled: "cursor-not-allowed text-white"
    }
};
