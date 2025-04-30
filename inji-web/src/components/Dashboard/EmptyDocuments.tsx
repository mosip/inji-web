import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/Background.svg";

export const EmptyDocuments: React.FC = () => {
  const { t } = useTranslation("Dashboard");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9FAFB] relative">
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4 sm:gap-0">
          <div className="flex items-center">
            <div className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 cursor-pointer" onClick={() => navigate("/")}>
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#000000"/>
              </svg>
              <h1 className="text-xl sm:text-2xl font-semibold">Stored Credentials</h1>
            </div>
            <span className="text-xs sm:text-sm text-[#5B03AD] ml-2 cursor-pointer hover:underline" onClick={() => navigate("/")}>Home</span>
          </div>
          <button
            onClick={() => navigate("/issuers")}
            className="bg-gradient-to-r from-[#FF5300] via-[#C5363C] to-[#5B03AD] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-shadow"
          >
            Add Credential
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center min-h-[300px]">
          <svg width="68" height="88" viewBox="0 0 68 88" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
            <path d="M17.847 88C15.611 88 13.744 87.246 12.246 85.739C10.749 84.231 10 82.353 10 80.102V7.898C10 5.647 10.749 3.769 12.246 2.261C13.744 0.754 15.611 0 17.847 0H56.143L78 22V80.102C78 82.353 77.251 84.231 75.754 85.739C74.256 87.246 72.389 88 70.153 88H17.847ZM53.714 24.444H73.143L53.714 4.889V24.444ZM27 70.889H61V66H27V70.889ZM27 51.333H61V46.444H27V51.333Z" fill="#DEDEDE"/>
          </svg>
          <h2 className="text-xl font-medium text-gray-800 mb-2">
            No documents stored yet
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            Lorem ipsum dolor sit amet consectetur. Ut nis facilisi condimentum odio nunc sem nisi.
          </p>
        </div>
      </div>

      <div className="absolute inset-0 z-0 overflow-hidden">
        <img src={backgroundImage} alt="Background" className="absolute top-0 left-0 w-full h-full object-cover" />
      </div>
    </div>
  );
};
