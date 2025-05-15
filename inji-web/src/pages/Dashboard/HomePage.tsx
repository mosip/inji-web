import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {IssuersPage} from "../IssuersPage.tsx";
import {convertStringIntoPascalCase} from "./utils.ts";
import {useUser} from "../../hooks/useUser.tsx";

export const HomePage: React.FC = () => {
    const {t} = useTranslation("Dashboard");
    const [displayName, setDisplayName] = useState<string | undefined>(undefined);
    const {user} = useUser();
    const userDisplayName = user?.displayName;

    useEffect(() => {
        setDisplayName(userDisplayName);
    }, [userDisplayName]);

    return (
        <div className="px-4 sm:px-6 md:px-10 lg:px-20 max-w-screen-xl mx-auto my-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#04051D] text-center mb-10">
                {`${t("Home.welcome")} ${convertStringIntoPascalCase(
                    displayName
                )}!`}
            </h1>
            <IssuersPage />
        </div>
    );
};
