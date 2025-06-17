import React from 'react';
import { PasscodePageStyles } from '../../pages/User/Passcode/PasscodePageStyles';
import { BackgroundDecorator } from '../Common/BackgroundDecorator';
import { CrossIconButton } from '../Common/Buttons/CrossIconButton';

interface PasscodePageTemplateProps {
  title: string;
  subtitle: string;
  error?: string | null;
  onErrorClose?: () => void;
  content: React.ReactNode;
  testId?: string;
}

export const PasscodePageTemplate: React.FC<PasscodePageTemplateProps> = ({
  title,
  subtitle,
  error,
  onErrorClose,
  content,
  testId = "passcode-page-template"
}) => {
  return (
    <div
      data-testid={testId}
      className={PasscodePageStyles.pageOverlay}
    >
      <div className={PasscodePageStyles.container}>
        <BackgroundDecorator
          logoSrc={require('../../assets/Logomark.png')}
          logoAlt="Inji Web Logo"
          logoTestId="logo-inji-web"
        />

        <div className={PasscodePageStyles.contentWrapper}>
          <div className={PasscodePageStyles.titleContainer}>
            <h1
              className={PasscodePageStyles.title}
              data-testid="title-passcode"
            >
              {title}
            </h1>
            <p
              className={PasscodePageStyles.description}
              data-testid="passcode-description"
            >
              {subtitle}
            </p>
          </div>

          <div
            className={PasscodePageStyles.passcodeContainer}
            data-testid="passcode-inputs-container"
          >
            {error && (
              <div
                className={PasscodePageStyles.errorContainer}
                data-testid="error-passcode"
              >
                <div className={PasscodePageStyles.errorContentWrapper}>
                  <div className={PasscodePageStyles.errorTextContainer}>
                    <span className={PasscodePageStyles.errorText}>
                      {error}
                    </span>
                  </div>
                  {onErrorClose && (
                    <div className={PasscodePageStyles.closeButtonContainer}>
                      <CrossIconButton
                        onClick={onErrorClose}
                        btnClassName={PasscodePageStyles.closeButton}
                        iconClassName={PasscodePageStyles.closeIcon}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={PasscodePageStyles.inputContainer}>
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};