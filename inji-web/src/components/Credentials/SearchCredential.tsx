import React, {useState} from "react";
import {FaSearch} from "react-icons/fa";
import {IoCloseCircleSharp} from "react-icons/io5";
import {CredentialWellknownObject} from "../../types/data";
import {storeFilteredCredentials} from "../../redux/reducers/credentialsReducer";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {getObjectForCurrentLanguage} from "../../utils/i18n";
import {RootState} from "../../types/redux";

export const SearchCredential:React.FC = () => {

    const {t} = useTranslation("CredentialsPage");
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const credentials = useSelector((state:RootState) => state.credentials.credentials);
    const language = useSelector((state:RootState) => state.common.language);

    const filterCredential = async (searchText: string) => {
        setSearchText(searchText)
        const filteredCredentials = credentials.filter( (credential:CredentialWellknownObject) => {
            const displayObject = getObjectForCurrentLanguage(credential.display, language);
            return (displayObject.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
        })
        dispatch(storeFilteredCredentials(filteredCredentials))
    }
    return <div className={"flex items-center w-full justify-start sm:justify-end my-5 sm:my-0"} data-testid="NavBar-Search-Container">
      <div data-testid="Search-Issuer-Container" className="w-full sm:w-96 flex justify-center items-center bg-iw-background shadow-md shadow-iw-shadow">
          <FaSearch data-testid="NavBar-Search-Icon"
                    color={'var(--iw-color-searchIcon)'}
                    className={"m-5"}
                    size={22}/>
          <input
              data-testid="NavBar-Search-Input"
              type="text"
              value={searchText}
              placeholder={t("searchText")}
              onChange={event => filterCredential(event.target.value)}
              className="py-6 w-11/12 flex text-iw-searchTitle focus:outline-none overflow-ellipsis mr-10"
          />
          {searchText.length > 0 && <IoCloseCircleSharp data-testid="NavBar-Search-Clear-Icon"
                                        onClick={() => filterCredential("")}
                                        color={'var(--iw-color-closeIcon)'}
                                        className={"m-5"}
                                        size={26}/>}
      </div>
  </div>
}
