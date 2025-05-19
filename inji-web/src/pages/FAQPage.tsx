import React from "react";
import {FAQAccordion} from "../components/Faq/FAQAccordion";
import {useTranslation} from "react-i18next";
import {useLocation, useNavigate} from "react-router-dom";
import { FAQPageProps } from "../components/Dashboard/types";

export const FAQPage: React.FC<FAQPageProps> = ({backUrl, withHome}) => {
    const {t} = useTranslation(["FAQPage", "Dashboard"]);
    const navigate = useNavigate();
    const location = useLocation();
    const previousPagePath = location.state?.from;

    const handleBackClick = () => {
        if (backUrl) {
            navigate(backUrl); // Navigate to the URL sent by the parent
        } else if (previousPagePath) {
            navigate(previousPagePath); // Navigate to the previous link in history
        } else {
            navigate("/dashboard/home"); // Navigate to homepage if opened directly
        }
    };

    return (
        <div
            className="w-full flex flex-col sm:flex-row justify-between items-start p-1 sm:p-2 md:p-4 flex-grow overflow-y-auto"
        >
            <div className="flex flex-row items-start gap-4 w-full">
                <div className="flex items-start">
                    <svg
                        width="29"
                        height="29"
                        viewBox="0 0 24 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 cursor-pointer"
                        onClick={handleBackClick}
                    >
                        <path
                            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                            fill="#000000"
                        />
                    </svg>
                </div>
                <div className="flex flex-col items-start gap-8 w-full mr-2 sm:mr-4 md:mr-8 lg:mr-10">
                    <div className="flex flex-col items-start">
                        <span className="text-2xl font-medium">
                            {t("title")}
                        </span>
                        {withHome && (
                            <span
                                className="text-xs sm:text-sm text-[#5B03AD] cursor-pointer hover:underline"
                                onClick={() => navigate("/dashboard/home")}
                            >
                                {t("Dashboard:Home.title")}
                            </span>
                        )}
                    </div>
                    <div
                        data-testid="Faq-Accordion-Container"
                        className="w-full"
                    >
                        <FAQAccordion />
                    </div>
                </div>
            </div>
        </div>
    );
};
