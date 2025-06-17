import React from 'react';
import {BackgroundDecorator} from '../../Common/BackgroundDecorator';
import {CrossIconButton} from '../../Common/Buttons/CrossIconButton';
import {BackArrowButton} from "../../Common/Buttons/BackArrowButton";
import {PasscodePageTemplateStyles} from "./PasscodePageTemplateStyles";

interface PasscodePageTemplateProps {
    title: string;
    subtitle: string;
    error?: string | null;
    onErrorClose?: () => void;
    content: React.ReactNode;
    testId: string;
    contentTestId: string;
    onBack?: () => void;
}

export const PasscodePageTemplate: React.FC<PasscodePageTemplateProps> = ({
                                                                              title,
                                                                              subtitle,
                                                                              error,
                                                                              onErrorClose,
                                                                              content,
                                                                              testId,
                                                                              contentTestId,
                                                                              onBack
                                                                          }) => {
    return (
        <div
            data-testid={`${testId}-page`}
            className={PasscodePageTemplateStyles.overlay}
        >
            <div className={PasscodePageTemplateStyles.container}>
                <BackgroundDecorator testId={`backdrop-${testId}`}/>

                <div className={PasscodePageTemplateStyles.contentWrapper}>
                    <div className={PasscodePageTemplateStyles.titleContainer}>
                        <h1
                            className={PasscodePageTemplateStyles.title}
                            data-testid={`title-${testId}`}
                        >
                            {title}
                        </h1>
                        {
                            onBack ? (
                                <div className={PasscodePageTemplateStyles.subTitle.container}>
                                    <BackArrowButton
                                        onClick={onBack}
                                        btnClassName={PasscodePageTemplateStyles.subTitle.backArrowButton}
                                    />
                                    <p
                                        className={PasscodePageTemplateStyles.subTitle.content}
                                        data-testid={`subtitle-${testId}`}
                                    >
                                        {subtitle}
                                    </p>
                                </div>
                            ) : <p
                                className={PasscodePageTemplateStyles.description}
                                data-testid={`${testId}-description`}
                            >
                                {subtitle}
                            </p>
                        }
                    </div>

                    <div
                        className={PasscodePageTemplateStyles.errorAndContentContainer}
                        data-testid={contentTestId}
                    >
                        {error && (
                            <div
                                className={PasscodePageTemplateStyles.errorContainer}
                                data-testid={`error-${testId}`}
                            >
                                <div className={PasscodePageTemplateStyles.errorContentWrapper}>
                                    <div className={PasscodePageTemplateStyles.errorTextContainer}>
                                        <span className={PasscodePageTemplateStyles.errorText}>
                                          {error}
                                        </span>
                                    </div>
                                    {onErrorClose && (
                                        <div className={PasscodePageTemplateStyles.closeButtonContainer}>
                                            <CrossIconButton
                                                onClick={onErrorClose}
                                                btnClassName={PasscodePageTemplateStyles.closeButton}
                                                iconClassName={PasscodePageTemplateStyles.closeIcon}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={PasscodePageTemplateStyles.contentContainer}>
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};