import React, {Fragment} from "react";
import {InfoSectionStyles} from "./InfoSectionStyles";
import LayoutStyles from "../LayoutStyles";

type InfoSectionProps =
    {
        title?: string,
        message?: string
        icon?: React.ReactElement
        mobileAction?: React.ReactElement
        testId: string
    }

export function InfoSection({
                                title,
                                message,
                                icon,
                                testId,
                                mobileAction
                            }: Readonly<InfoSectionProps>): React.ReactElement {
    return <div
        data-testid={`${testId}-container`}
        className={LayoutStyles.sectionWithWhiteBg}
    >
        {icon && <Fragment>{icon}</Fragment>}
        <div className={InfoSectionStyles.content}>
            {title && <h2
                data-testid={`${testId}-title`}
                className={InfoSectionStyles.title}
            >
                {title}
            </h2>}
            {message && <span className={InfoSectionStyles.message} data-testid={`${testId}-message`}>{message}</span>}
        </div>
        {mobileAction &&
            <div className={InfoSectionStyles.action}>
                {mobileAction}
            </div>
        }
    </div>;
}