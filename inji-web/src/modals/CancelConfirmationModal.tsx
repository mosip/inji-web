import React from "react";
import { ModalWrapper } from "./ModalWrapper";

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

  if (!isOpen) return null;

  return (
    <ModalWrapper
      zIndex={50}
      size="md"
      header={<></>}
      footer={<></>}
      content={
        <div className="flex flex-col items-center text-center px-6 py-15 sm:p-8">

          <h2 className="text-md sm:text-2xl font-semibold text-gray-900 mb-7 mt-8">
            Are you sure you want to cancel?
          </h2>

          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            If you cancel this, your request will not be processed and may be lost.
          </p>

          <div className="space-y-3 w-full mb-8">
            <button
              onClick={onConfirm}
              className="w-full bg-[linear-gradient(90deg,_#FF5300_0%,_#FB5103_16%,_#F04C0F_31%,_#DE4322_46%,_#C5363C_61%,_#A4265F_75%,_#7C1389_90%,_#5B03AD_100%)] text-white font-medium py-2.5 rounded-lg transition mt-4 mb-2"
            >
              Yes, Cancel
            </button>
            <button
              onClick={onClose}
              className="w-full border-2 border-[#D64246] text-[#D64246] font-medium py-2.5 rounded-lg"
            >
              Go back
            </button>
          </div>
        </div>
      }
    />
  );
};