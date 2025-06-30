import {BsShieldFillExclamation} from "react-icons/bs";
import React from "react";
import {ErrorStyles} from "./ErrorStyles";
import LayoutStyles from "../Common/LayoutStyles";

const ErrorIcon: React.FC = () => {
    return <div className={ErrorStyles.icon.container}>
        <div className={ErrorStyles.icon.innerContainer}>
            <BsShieldFillExclamation
                data-testid="error-exclamation-icon" size={40} color={'var(--iw-color-shieldErrorIcon)'}/>
        </div>
    </div>
}

type ErrorProps = {
    message: string;
    helpText: string;
    testId: string;
    action?: React.ReactNode;
};

export function ErrorDisplay({
                          message,
                          helpText,
                          testId,
                          action
                      }: Readonly<ErrorProps>) {
    return (
        <div
            data-testid={`error-container-${testId}`}
            className={LayoutStyles.sectionWithWhiteBg}
        >
            <ErrorIcon/>
            <p className={ErrorStyles.message} data-testid={`error-message-${testId}`}>{message}</p>
            <p className={ErrorStyles.helpText} data-testid={`error-helpText-${testId}`}>{helpText}</p>
            {
                action && (
                    <div className={ErrorStyles.actionBlock} data-testid={`error-action-block-${testId}`}>
                        {action}
                    </div>
                )
            }
        </div>
    )
}