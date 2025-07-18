import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {FaSearch} from 'react-icons/fa';
import {useDispatch, useSelector} from "react-redux";
import {storeFilteredIssuers} from "../../redux/reducers/issuersReducer";
import {IssuerObject} from "../../types/data";
import {IoCloseCircleSharp} from "react-icons/io5";
import {RootState} from "../../types/redux";
import {getIssuerDisplayObjectForCurrentLanguage} from "../../utils/i18n";
import { SearchIssuerStyles } from "./SearchIssuerStyles";

export const SearchIssuer: React.FC = () => {

    const {t} = useTranslation("IssuersPage");
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const issuers = useSelector((state:RootState) => state.issuers.issuers);
    const language = useSelector((state:RootState) => state.common.language);
    const filterIssuers = async (searchText: string) => {
        setSearchText(searchText);
        setIsSearchValid(issuerRegex.test(searchText) || searchText === "");
        const filteredIssuers = issuers.filter( (issuer:IssuerObject) => {
            const displayObject = getIssuerDisplayObjectForCurrentLanguage(issuer.display, language);
            return (displayObject?.name?.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 && issuer.protocol !== 'OTP')
        })
        dispatch(storeFilteredIssuers(filteredIssuers));
    }
    const issuerRegex = /^[a-zA-Z0-9\s\-_()]*$/;
    const [isSearchValid, setIsSearchValid] = useState(true);

    return (
        <div className="flex flex-col justify-center items-center w-full">
            <div
                data-testid="Search-Issuer-Container"
                className="w-full sm:w-4/4 md:w-3/4 flex justify-start items-center bg-iw-background shadow-iw rounded-lg"
            >
                <FaSearch
                    data-testid="Search-Issuer-Search-Icon"
                    color={"var(--iw-color-searchIcon)"}
                    className="m-2 sm:m-3 md:m-4 lg:m-5"
                    size={20}
                />
                <input
                    data-testid="Search-Issuer-Input"
                    type="text"
                    value={searchText}
                    placeholder={t("Intro.searchText")}
                    onChange={(event) => filterIssuers(event.target.value)}
                    className="py-2 sm:py-3 md:py-4 lg:py-6 w-3/4 sm:w-11/12 text-iw-searchTitle focus:outline-none overflow-ellipsis ml-0 mr-2 sm:mr-3 md:mr-4 lg:mr-10"
                />
                {searchText.length > 0 && (
                    <IoCloseCircleSharp
                        data-testid="Search-Issuer-Clear-Icon"
                        onClick={() => filterIssuers("")}
                        className="m-2 sm:m-3 md:m-4 lg:m-5 cursor-pointer"
                        color={"var(--iw-color-closeIcon)"}
                        size={20}
                    />
                )}
            </div>
            <div className="text-left w-full sm:w-4/4 md:w-3/4 mt-3" data-testid="Search-Issuer-HelperAndError-Text">
            {!isSearchValid && (
                <p className={SearchIssuerStyles.regexError}>
                    { t("searchIssuer.helpText.error") }
                </p>)
            }
            {isSearchValid && (
                <p className={SearchIssuerStyles.infoMsg}>
                    { t("searchIssuer.helpText.info") }
                </p>)
            }
            </div>
        </div>
    );
}

