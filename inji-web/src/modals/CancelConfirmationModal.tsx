import React from "react";
import { ModalWrapper } from "./ModalWrapper";
import { useTranslation } from "react-i18next";
import { SolidButton } from "../components/Common/Buttons/SolidButton";
import { BorderedButton } from "../components/Common/Buttons/BorderedButton";

const CancelConfirmationModalStyles = {
    wrapper: "flex flex-col items-center text-center px-6 py-12 sm:p-8",
    title: "text-md sm:text-2xl font-semibold text-gray-900 mb-7 mt-8",
    description: "text-gray-600 mb-6 mx-2 md:mx-8 text-sm sm:text-base",
    buttonsContainer: "space-y-3 w-full mb-8",
    confirmButton: `
        !py-2.5 !rounded-lg font-medium transition mt-4 mb-2 !text-base !font-bold
    `,
    goBackButton: "!py-2.5"
};


interface CancelConfirmationModalProps {
  isOpen: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}

export const CancelConfirmationModal: React.FC<CancelConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onClose = () => { },
}) => {
  const { t } = useTranslation("VerifierTrustPage");
  if (!isOpen) return null;

  const styles = CancelConfirmationModalStyles;

  return (
    <ModalWrapper
      zIndex={50}
      size="xl"
      header={<></>}
      footer={<></>}
      content={
        <div className={styles.wrapper}>

          <h2 data-testid="title-cancel-confirmation" className={styles.title}>
            {t(`cancelConfirmationModal.title`)}
          </h2>

          <p data-testid="text-cancel-confirmation-description" className={styles.description}>
            {t(`cancelConfirmationModal.description`)}
          </p>

          <div className={styles.buttonsContainer}>
            <SolidButton
              testId="btn-confirm-cancel"
              onClick={onConfirm}
              title={t(`cancelConfirmationModal.confirmButton`)}
              fullWidth
              className={styles.confirmButton}
            />
            <BorderedButton
              testId="btn-go-back"
              onClick={onClose}
              title={t(`cancelConfirmationModal.goBackButton`)}
              className={styles.goBackButton}
            />
          </div>
        </div>
      }
    />
  );
};
