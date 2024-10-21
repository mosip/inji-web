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
                className="fixed top-0 left-0 right-0 bg-iw-background py-7 shadow-sm">
            <div className="container mx-auto flex justify-between items-center px-4">
                <div data-testid="Header-InjiWeb-Logo-Container" className={"flex flex-row justify-center items-center"}>
                    <div  role="button" tabIndex={0} className={"sm:hidden"} onClick={() => setIsOpen(open => !open)} onKeyUp={() => setIsOpen(open => !open)}>
                        <GiHamburgerMenu size={32}/>
                    </div>
                    <div role={"button"}
                         tabIndex={0}
                         onClick={() => navigate("/")}
                         onKeyUp={() => navigate("/")}>
                        <img src={require("../../assets/InjiWebLogo.png")}
                             className={"h-13 w-28 scale-150 cursor-pointer"}
                             data-testid="Header-InjiWeb-Logo"
                             alt="Inji Web Logo"/>
                    </div>
                </div>
                <nav>
                    <ul className="flex space-x-4 items-center font-semibold" data-testid="Header-Menu-Elements">
                        <li data-testid="Header-Menu-AboutInji"><a href="https://docs.mosip.io/inji/inji-web/overview"
                                                                   target="_blank"
                                                                   rel="noreferrer"
                                                                   className="text-iw-title hidden sm:inline-block">{t("Header.aboutInji")}</a>
                        </li>
                        <li data-testid="Header-Menu-Help">
                            <div data-testid="Header-Menu-Help-div"
                                 onClick={() => navigate("/help") }
                                 onKeyUp={() => navigate("/help") }
                                 role="button"
                                 tabIndex={0}
                                 className="text-iw-title cursor-pointer hidden sm:inline-block">{t("Header.help")}</div>
                        </li>
                        <li data-testid="Header-Menu-LanguageSelector"><LanguageSelector/></li>
                    </ul>
                </nav>
            </div>
            { isOpen &&
                <OutsideClickHandler onOutsideClick={()=>setIsOpen(false)} >
                    <div className="container mx-auto px-4 flex flex-col justify-start items-start font-semibold"
                         role="button"
                         tabIndex={0}
                         onMouseDown={() => setIsOpen(false)}
                         onBlur={() => setIsOpen(false)}>
                        <div data-testid="Header-Menu-AboutInji"
                             className={"py-5 w-full"}
                             role="button"
                             tabIndex={0}
                             onKeyUp={() => {window.open("https://docs.mosip.io/inji/inji-web/overview", "_blank","noopener");setIsOpen(false)}}
                             onClick={() => {window.open("https://docs.mosip.io/inji/inji-web/overview", "_blank","noopener");setIsOpen(false)}}>
                            {t("Header.aboutInji")}
                        </div>
                        <div data-testid="Header-Menu-Help"
                             role="button"
                             tabIndex={0}
                             onKeyUp={() => {navigate("/help");setIsOpen(false)}}
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

