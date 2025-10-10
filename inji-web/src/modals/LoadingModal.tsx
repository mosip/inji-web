import React from "react";
import { ColorRing } from "react-loader-spinner";
import { ModalWrapper } from "./ModalWrapper";

interface LoaderModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
}

export const LoaderModal: React.FC<LoaderModalProps> = ({
  isOpen,
  title = "Fetching the verifier Info...",
  subtitle = "Please wait while we verify the request…",
}) => {
  if (!isOpen) return null;

  return (
    <ModalWrapper
      zIndex={50}
      size="xl"
      header={<></>}
      footer={<></>}
      content={
        
            <div className="flex flex-col items-center justify-center py-[18rem] px-[6rem] text-center">
          {/* Spinner */}
          <div className="mb-6">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="loading-indicator"
              colors={["#D64246", "#D64246", "#D64246", "#D64246", "#D64246"]}
            />
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 text-sm mt-2">
            {subtitle}
          </p>
        </div>
      }
    />
  );
};
