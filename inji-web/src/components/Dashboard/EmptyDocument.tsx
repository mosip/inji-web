import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

export const EmptyDocument: React.FC = () => {
    const {t} = useTranslation("Dashboard");
    const navigate = useNavigate();

    return (
        <div className="container mx-auto sm:px-2 md:px-4 lg:px-6 py-6 relative ml-3 sm:ml-0">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 gap-4 sm:gap-0">
                <div className="flex items-start">
                    <div className="flex items-start">
                        <svg
                            data-testid={'Back-Arrow-Icon'}
                            width="29"
                            height="29"
                            viewBox="0 0 24 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-2 cursor-pointer"
                            onClick={() => navigate('/dashboard/home')}
                        >
                            <path
                                d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                                fill="#000000"
                            />
                        </svg>
                    </div>
                    <div className="flex flex-col items-start">
                        <span
                            data-testid={'Stored-Credentials'}
                            className="text-2xl font-medium"
                        >
                            {t('StoredCredentials.title')}
                        </span>
                        <span
                            data-testid={'Home'}
                            className="text-xs sm:text-sm text-[#5B03AD] cursor-pointer hover:underline"
                            onClick={() => navigate('/dashboard/home')}
                        >
                            {t('Home.title')}
                        </span>
                    </div>
                </div>
                <div className="hidden sm:block">
                    <button
                        data-testid="Add-Credential"
                        onClick={() => navigate('/dashboard/home')}
                        className="bg-gradient-to-r from-[#FF5300] via-[#C5363C] to-[#5B03AD] text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-sm transition-shadow"
                    >
                        {t('StoredCredentials.header.addCredential')}
                    </button>
                </div>
            </div>

            <div
                data-testid={'Blank-Document'}
                className="bg-white rounded-lg shadow-iw-emptyDocuments p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center min-h-[500px] my-4 sm:my-8 md:my-16"
            >
                <svg
                    data-testid={'Document-Icon'}
                    width="88"
                    height="88"
                    viewBox="0 0 68 88"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-8 sm:mb-12 md:mb-20"
                >
                    <path
                        d="M17.847 88C15.611 88 13.744 87.246 12.246 85.739C10.749 84.231 10 82.353 10 80.102V7.898C10 5.647 10.749 3.769 12.246 2.261C13.744 0.754 15.611 0 17.847 0H56.143L78 22V80.102C78 82.353 77.251 84.231 75.754 85.739C74.256 87.246 72.389 88 70.153 88H17.847ZM53.714 24.444H73.143L53.714 4.889V24.444ZM27 70.889H61V66H27V70.889ZM27 51.333H61V46.444H27V51.333Z"
                        fill="#DEDEDE"
                    />
                </svg>
                <h2
                    data-testid={'No-Credentials-Title'}
                    className="text-xl text-center sm:text-2xl font-medium text-gray-800 mb-2"
                >
                    {t('StoredCredentials.emptyScreen.title')}
                </h2>
                <p
                    data-testid={'No-Credentials-Subtitle'}
                    className="text-gray-500 text-center max-w-md font-small"
                >
                    Lorem ipsum dolor sit amet consectetur. Ut nis facilisi
                    condimentum odio nunc sem nisi.
                </p>
                <div className="block sm:hidden mt-6">
                    <button
                        data-testid={'Blank-Document-Add-Credential'}
                        onClick={() => navigate('/dashboard/home')}
                        className="bg-gradient-to-r from-[#FF5300] via-[#C5363C] to-[#5B03AD] text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-sm transition-shadow"
                    >
                        {t('StoredCredentials.header.addCredential')}
                    </button>
                </div>
            </div>
        </div>
    );
};
