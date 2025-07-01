import React from "react";
import {SearchCredential} from "../../Credentials/SearchCredential";
import {NavBackArrowButton} from "../../Common/Buttons/NavBackArrowButton";
import {IssuerWellknownDisplayArrayObject} from "../../../types/data";
import {useTranslation} from "react-i18next";
import {TertiaryButton} from "../../Common/Buttons/TertiaryButton";
import {HeaderStyles} from "./HeaderStyles";

interface HeaderPops {
    onBackClick: () => void,
    displayObject: IssuerWellknownDisplayArrayObject | undefined,
    onClick: () => void,
}

export const Header: React.FC<HeaderPops> = (props) => {
    const {t} = useTranslation('User');
    return <div className={HeaderStyles.headerContainer}>
        <div className={HeaderStyles.headerLeftSection}>
            <div className={HeaderStyles.headerLeftSection}>
                <NavBackArrowButton onBackClick={props.onBackClick}/>
            </div>
            <div className={HeaderStyles.headerTitleSection}>
                <span
                    data-testid={"Stored-Credentials"}
                    className={HeaderStyles.pageTitle}
                >
                    {props.displayObject?.name}
                </span>

                <TertiaryButton onClick={props.onClick} title={t('Common:home')} testId={"home"}/>
            </div>
        </div>
        <div>
            <SearchCredential
                issuerContainerBorderRadius={"rounded-md"}
            />
        </div>
    </div>;
}