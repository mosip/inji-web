import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {LanguageSelector} from "../Common/LanguageSelector";
import {GiHamburgerMenu} from "react-icons/gi";
import OutsideClickHandler from 'react-outside-click-handler';

export const Header: React.FC = () => {

    const {t} = useTranslation("PageTemplate");
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header>
        <div data-testid="Header-Container"
                className="fixed top-0 left-0 right-0 bg-iw-background py-4 shadow-sm">
            <div className="container mx-auto flex justify-between items-center px-4">
                <div data-testid="Header-InjiWeb-Logo-Container" className={"flex flex-row justify-center items-center"}>
                    <div className={"sm:hidden"} onClick={() => setIsOpen(open => !open)}>
                        <GiHamburgerMenu size={32}/>
                    </div>
                    <img src={require("../../assets/InjiWebLogo.png")}
                         onClick={() => navigate("/")}
                         className={"h-13 w-28 cursor-pointer"}
                         data-testid="Header-InjiWeb-Logo"
                         alt="Inji Web Logo"/>
                </div>
                <nav>
                    <ul className="flex space-x-4 items-center font-semibold" data-testid="Header-Menu-Elements">
                        <li data-testid="Header-Menu-AboutInji"><a href="https://docs.mosip.io/inji/inji-web/overview"
                                                                   target="_blank"
                                                                   rel="noreferrer"
                                                                   className="text-iw-title hidden sm:inline-block">{t("Header.aboutInji")}</a>
                        </li>
                        <li data-testid="Header-Menu-Help">
                            <div data-testid="Header-Menu-Help-div" onClick={() => navigate("/help")}
                                 className="text-iw-title cursor-pointer hidden sm:inline-block">{t("Header.help")}</div>
                        </li>
                        <li data-testid="Header-Menu-LanguageSelector"><LanguageSelector/></li>
                    </ul>
                </nav>
            </div>
            { isOpen &&
                <OutsideClickHandler onOutsideClick={()=>setIsOpen(false)}>
                    <div className="container mx-auto px-4 flex flex-col justify-start items-start font-semibold" onBlur={() => {console.log("Blur is pressed");setIsOpen(false)}}>
                        <div data-testid="Header-Menu-AboutInji" className={"py-5 w-full"}
                             onClick={() => {window.open("https://docs.mosip.io/inji/inji-web/overview");setIsOpen(false)}}>
                            {t("Header.aboutInji")}
                        </div>
                        <div data-testid="Header-Menu-Help"
                             onClick={() => {navigate("/help");setIsOpen(false)}}
                             className="text-iw-title cursor-pointer py-5 w-full inline-block sm:hidden">
                                {t("Header.help")}
                        </div>
                    </div>
                </OutsideClickHandler>
            }
        </div>
        </header>
    )

}

