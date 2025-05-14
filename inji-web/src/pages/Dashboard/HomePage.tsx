import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {IssuersPage} from "../IssuersPage.tsx";
import { convertStringIntoPascalCase } from "./utils.ts";

export const HomePage: React.FC = () => {
    const {t} = useTranslation("Dashboard");
    const [displayName, setDisplayName] = useState<string | null>(null);

    useEffect(() => {
        console.log("inside useEffect", localStorage.getItem("displayName"));
        setDisplayName(localStorage.getItem("displayName"));
    }, [localStorage.getItem("displayName")]);

    return (
        <div className="m-10">
            <h1 className="text-3xl font-medium text-[#04051D] flex justify-center items-center mb-10">
                {`${t("Home.welcome")} ${convertStringIntoPascalCase(displayName)}!`}
            </h1>
            <IssuersPage />
        </div>
    );
};
