import React, {Fragment} from "react";

type InfoSectionProps =
    {
        title?: string,
        actionText?: string
        icon?: React.ReactElement
    }

export function InfoSection({
                                title,
                                actionText,
                                icon
                            }: Readonly<InfoSectionProps>): React.ReactElement {
    return <div
        data-testid={"no-cards-stored"}
        className="bg-white rounded-lg shadow-iw-emptyDocuments p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center min-h-[500px] my-4 sm:my-8 md:my-16"
    >
        {icon && <Fragment>{icon}</Fragment>}
        {title && <h2
            data-testid={"No-Credentials-Title"}
            className="text-xl text-center sm:text-2xl font-medium text-gray-800 mb-2"
        >
            {title}
        </h2>}
        {actionText && <span>{actionText}</span>}
    </div>;
}