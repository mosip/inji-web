import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {FaSearch} from 'react-icons/fa';
import {useDispatch} from "react-redux";
import {storeIssuers} from "../../redux/reducers/issuersReducer";
import {api} from "../../utils/api";
import {ApiRequest, IssuerObject} from "../../types/data";
import {IoCloseCircleSharp} from "react-icons/io5";
import {SearchIssuerProps} from "../../types/components";

export const SearchIssuer: React.FC<SearchIssuerProps> = (props) => {

    const {t} = useTranslation("HomePage");
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const filterIssuers = async (searchText: string) => {
        setSearchText(searchText);
        const apiRequest: ApiRequest = api.searchIssuers;
        const response = await props.fetchRequest(
            apiRequest.url(searchText),
            apiRequest.methodType,
            apiRequest.headers()
        );
        dispatch(storeIssuers(response?.response?.issuers.filter((issuer: IssuerObject) => issuer.protocol !== 'OTP')))
    }

    return <React.Fragment>
        <div data-testid="Search-Issuer-Container" className="mb-8 w-full flex pb-14">
            <div className="relative w-3/5 mx-auto flex justify-center items-center">
                <FaSearch data-testid="Search-Issuer-Search-Icon"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-searchIcon dark:text-dark-searchIcon ml-2"
                          size={20}/>
                <input
                    data-testid="Search-Issuer-Input"
                    type="text"
                    value={searchText}
                    placeholder={t("Intro.searchText")}
                    onChange={event => filterIssuers(event.target.value)}
                    className="py-6 pl-16 pr-4 rounded-md w-full shadow-md text-light-searchTitle dark:text-dark-searchTitle focus:outline-none"
                />
                {searchText.length > 0 && <IoCloseCircleSharp data-testid="Search-Issuer-Clear-Icon"
                                                              className="absolute right-5 top-1/2 transform -translate-y-1/2 text-light-closeIcon dark:text-dark-closeIcon ml-2 cursor-pointer"
                                                              onClick={() => filterIssuers("")}
                                                              size={20}/>}
            </div>
        </div>
    </React.Fragment>
}

