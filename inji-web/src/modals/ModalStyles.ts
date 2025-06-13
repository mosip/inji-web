export const ModalStyles = {
    confirmation: {
        container: "flex flex-col items-center pt-4 pb-4 px-8 gap-3",
        title: "text-2xl justify-center font-medium text-center text-[--iw-color-textTertiary]",
        message: "text-[--iw-color-textTertiary] font-base font-light text-sm",
        buttonsContainer: "flex items-center justify-around sm:flex-row flex-col gap-4 w-full pt-3",
        cancelButton: "py-2"
    },
    modal: {
        overlay: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",
        container: "bg-white rounded-lg shadow-lg mx-4 my-2 mt-10 flex flex-col relative pt-6 border-4 border-white",
        header: {
            wrapper: "mb-4 flex items-center justify-between px-6 flex-shrink-0 gap-4",
            closeButton: "text-gray-500 hover:text-gray-700 text-2xl font-bold",
        },
        separator: "flex-shrink-0",
        content: {
            wrapper: "flex flex-col flex-1 relative sm:bg-transparent bg-white sm:mb-4 pb-0 min-h-0",
            container: "overflow-y-auto flex-1 min-h-0 sm:mx-5 sm:m-0 m-2 sm:bg-transparent bg-white sm:rounded-none rounded-xl"
        },
        action: "sm:absolute sm:right-6 sm:bottom-0 sm:mr-10 sm:pb-8 sm:bg-transparent sm:w-auto static bg-white flex px-2 w-full py-2 sm:rounded-b-lg"
    }
}