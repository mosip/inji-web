export const convertStringIntoPascalCase = (text: string | undefined) => {
    return (
        text &&
        text
            .toLocaleLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
    );
};

export const getProfileInitials = (displayName: string | undefined) => {
    return displayName
        ? displayName
              .split(" ")
              .map((name) => name.charAt(0).toUpperCase())
              .join("")
        : "U";
};
