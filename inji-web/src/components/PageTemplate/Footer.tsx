import React from "react";
import {useTranslation} from "react-i18next";

export const Footer: React.FC = () => {
    const {t} = useTranslation("PageTemplate")
    const logo = require('../../assets/InjiWebLogoonly.png'); // Adjust the path to your image

    return <footer
            data-testid="Footer-Container"
            className="fixed bottom-0 left-0 right-0 py-6 pl-4 shadow-sm shadow-iw-shadow bg-iw-footer"
        >
            <div className="container mx-12 flex items-center">
                <img src={logo} alt="Logo" className="h-8 mr-2" />
                <p data-testid="Footer-Text" className="text-gray-500 font-semibold">{t("Footer.copyRight")}</p>
            </div>
        </footer>
};