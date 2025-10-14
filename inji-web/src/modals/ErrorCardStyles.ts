export const ErrorCardStyles = {
    errorCard: {
        wrapper: "flex flex-col items-center justify-center py-8 px-6 text-center",
        iconContainer: "w-108 h-108 flex items-center justify-center mb-4",
        iconImage: "w-[108px] h-[108px]",
        title: "text-xl font-semibold text-gray-800 mb-4",
        description: "text-gray-500 mb-8",
        buttonContainer: "w-full flex justify-center",
        closeButton: `
            max-w-md !bg-[linear-gradient(90deg,_#FF5300_0%,_#FB5103_16%,_#F04C0F_31%,_#DE4322_46%,_#C5363C_61%,_#A4265F_75%,_#7C1389_90%,_#5B03AD_100%)] from-red-500 to-purple-600 
            !py-3 !rounded-md !font-medium !text-white hover:opacity-90 focus:outline-none
        `
    }
};