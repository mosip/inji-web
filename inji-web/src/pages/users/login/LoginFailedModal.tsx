import React, { CSSProperties } from 'react';
import { useNavigate } from "react-router-dom";
import { SolidButton } from '../../../components/Common/Buttons/SolidButton';
import { useTranslation } from "react-i18next";

export const LoginFailedModal: React.FC = () => {
  const { t } = useTranslation("HomePage");
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden fixed inset-0 backdrop-blur-md bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-xl pt-14 pb-10 px-12 md:px-20 max-w-md text-center mx-5">
        <div className="flex justify-center mb-2" data-testid="failure-icon">
          <img src={require("../../../assets/failure_message_icon.png")} className="text-green-500 w-16 h-16 md:w-24 md:h-24" />
        </div>
        <h2 className="text-xl md:text-2xl text-gray-800 mb-2" data-testid="failure-message">{t("LoginFailedModal.failure-message")}</h2>
        <p className=" text-sm md:text-base text-gray-600 font-extralight mb-6" data-testid="failure-description">
          {t("LoginFailedModal.failure-description")}
        </p>
        
        <SolidButton testId="Login-Failure-Button" onClick={() => navigate("/pin")} title={t("LoginFailedModal.retry")} />
      </div>
    </div>
  );
};