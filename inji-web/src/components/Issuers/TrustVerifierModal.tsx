import React from "react";
import { ModalWrapper } from "../../modals/ModalWrapper";
import { useTranslation } from "react-i18next";
import { SolidButton } from "../Common/Buttons/SolidButton";
import { SecondaryBorderedButton } from "../Common/Buttons/SecondaryBorderedButton";
import { InfoTooltipTrigger } from "../Common/ToolTip/InfoTooltipTrigger";
import { TrustVerifierModalStyles } from "./TrustVerifierModalStyles";
import { PlainButtonNormal } from "../Common/Buttons/PlainButtonNormal";
import LogoIcon from "../../assets/logo.svg";


interface TrustVerifierModalProps {
    isOpen: boolean;
    logo?: string | null;
    verifierName?: string;
    verifierDomain?: string;
    onTrust?: () => void;
    onNotTrust?: () => void;
    onCancel?: () => void;
}

export const TrustVerifierModal: React.FC<TrustVerifierModalProps> = ({
    isOpen,
    logo,
    verifierName,
    verifierDomain,
    onTrust,
    onNotTrust,
    onCancel = () => { },
}) => {
    const { t } = useTranslation("VerifierTrustPage");
    
    if (!isOpen) return null;

    const styles = TrustVerifierModalStyles.trustModal;

    const trustPoints = [
        t(`modal.point1`),
        t(`modal.point2`),
        t(`modal.point3`),
    ];

    return (
        <ModalWrapper
            zIndex={50}
            size="xl"
            header={<></>}
            footer={<></>}
            content={
                <div
                    data-testid="trust-verifier-content"
                    className={styles.wrapper}
                >
                    <div className={styles.logoContainer}>
                        {logo ? (
                            <img
                                src={logo}
                                alt={`${verifierName} logo`}
                                className={styles.logoImage}
                            />
                        ) : (
                            <img
                                src={LogoIcon}
                                alt={`${verifierName} logo`}
                                className={styles.logoImage}
                            />
                        )}
                    </div>


                    <h1
                        id="trustscreen-title"
                        className={styles.title}
                    >
                        {verifierName || t(`modal.title`)}
                    </h1>

                    <p
                        id="trustscreen-description"
                        className={styles.description}
                    >
                        {t(`modal.description`)}
                    </p>

                    <ul className={styles.list}>
                        {trustPoints.map((text, i) => (
                            <li key={i} className={styles.listItem}>
                                <span 
                                    className={styles.listItemBullet} 
                                    aria-hidden="true" 
                                >
                                    •
                                </span>
                                <span>{text}</span>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.buttonsContainer}>
                        <SolidButton
                            testId="trustscreen-yes-button"
                            onClick={onTrust}
                            title={t(`modal.trustButton`)}
                            fullWidth
                            className={styles.trustButton}
                        />

                        <SecondaryBorderedButton
                            testId="trustscreen-no-button"
                            onClick={onNotTrust}
                            title={t(`modal.notTrustButton`)}
                            fullWidth
                        />


                        <PlainButtonNormal
                            testId="trustscreen-cancel-button"
                            onClick={onCancel}
                            title={t(`modal.cancelButton`)}
                        />
                    </div>


                    <InfoTooltipTrigger
                        infoButtonText={t('modal.infoTooltipButton')}
                        tooltipText={t('modal.infoTooltipText')}
                    />
                </div>
            }
        />
    );
};
