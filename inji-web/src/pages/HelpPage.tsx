import React from "react";
import {HelpAccordion} from "../components/Help/HelpAccordion";
import {NavBar} from "../components/Common/NavBar";
import {useTranslation} from "react-i18next";
import { useLocation } from "react-router-dom";

export const HelpPage: React.FC<HelpPageProps> = ({backUrl}) => {
    const {t} = useTranslation("HelpPage");

    const location = useLocation();
    const previousPath = location.state?.from;

    const handleBackClick = () => {
        if (backUrl) {
            return backUrl; // Navigate to the URL sent by the parent
        } else if (previousPath) {
            return previousPath; // Navigate to the previous link in history
        } else {
            return "/dashboard/home"; // Navigate to homepage if opened directly
        }
    };


    return (
        <div
            className={"bg-iw-background pb-28"}
            data-testid="Help-Page-Container"
        >
            <NavBar title={t("title")} search={false} link={handleBackClick()}/>
            <div className="container mx-auto mt-8 px-10 sm:px-0 ">
                <HelpAccordion />
            </div>
        </div>
    );
};

type HelpPageProps = {
    backUrl?: string;
}
