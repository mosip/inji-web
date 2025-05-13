export const convertStringIntoPascalCase = (text: string | null) => {
    if (text != null) {
        return text
            .toLocaleLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
};
