import React from "react";
import {useTranslation} from "react-i18next";

export const Footer: React.FC = () => {

    const {t} = useTranslation("PageTemplate")
    return <footer
        data-testid="Footer-Container"
        className="fixed bottom-0 left-0 right-0 py-4 transform rotate-180 shadow-sm shadow-iw-shadow bg-iw-footer">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-end sm:items-center">
            <p data-testid="Footer-Text" className="ps-7 text-iw-subText transform rotate-180">{t("Footer.copyRight")}</p>
            <div className={"flex flex-row items-center me-4"}>
                <p data-testid="Footer-Text" className="text-black transform rotate-180 font-bold">{t("Footer.product")}</p>
                <img className={"w-10 h-10 transform rotate-180 m-2"} src={"https://api.collab.mosip.net/inji/mosip-logo.png"} alt={"a square mosip logo"} />
            </div>
        </div>
    </footer>;
}
