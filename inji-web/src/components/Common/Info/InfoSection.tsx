import React, {Fragment} from "react";
import {InfoSectionStyles} from "./InfoSectionStyles";

type InfoSectionProps =
    {
        title?: string,
        message?: string
        icon?: React.ReactElement
        testId: string
    }

export function InfoSection({
                                title,
                                message,
                                icon,
                                testId
                            }: Readonly<InfoSectionProps>): React.ReactElement {
    return <div
        data-testid={`${testId}-container`}
        className={InfoSectionStyles.container}
    >
        {icon && <Fragment>{icon}</Fragment>}
        {title && <h2
            data-testid={`${testId}-title`}
            className={InfoSectionStyles.title}
        >
            {title}
        </h2>}
        {message && <span data-testid={`${testId}-message`}>{message}</span>}
    </div>;
}