import React from "react";
import {HelpAccordion} from "../components/Help/HelpAccordion";
import {NavBar} from "../components/Common/NavBar";
import {useTranslation} from "react-i18next";

export const HelpPage: React.FC = () => {
    const {t} = useTranslation("HelpPage")
    return <div className={"bg-iw-background pb-28"} data-testid="Help-Page-Container">
            <NavBar title={t("title")} search={false} link={"/"}/>
            <div className="container mx-auto mt-8 px-10 sm:px-0 ">
                <HelpAccordion/>
            </div>
        </div>
}
