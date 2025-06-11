import React from "react";
import {SearchCredential} from "../../../components/Credentials/SearchCredential";
import {CredentialTypesPageStyles} from "./CredentialTypesPageStyles";
import {NavBackArrowButton} from "../../../components/Common/Buttons/NavBackArrowButton";
import {IssuerWellknownDisplayArrayObject} from "../../../types/data";
import {useTranslation} from "react-i18next";

interface HeaderPops {
    onBackClick: () => void,
    displayObject: IssuerWellknownDisplayArrayObject,
    onClick: () => void,
}

export const Header: React.FC<HeaderPops> = (props) => {
    const {t} = useTranslation('User');
    return <div className={CredentialTypesPageStyles.headerContainer}>
        <div className={CredentialTypesPageStyles.headerLeftSection}>
            <div className={CredentialTypesPageStyles.headerLeftSection}>
                <NavBackArrowButton onBackClick={props.onBackClick}/>
            </div>
            <div className={CredentialTypesPageStyles.headerTitleSection}>
                        <span
                            data-testid={"Stored-Credentials"}
                            className={CredentialTypesPageStyles.pageTitle}
                        >
                            {props.displayObject?.name}
                        </span>
                <button
                    data-testid={"Home"}
                    className={CredentialTypesPageStyles.homeButton}
                    onClick={props.onClick}
                >
                    {t('User:Home.title')}
                </button>
            </div>
        </div>
        <div>
            <SearchCredential
                issuerContainerBorderRadius={"rounded-md"}
            />
        </div>
    </div>;
}