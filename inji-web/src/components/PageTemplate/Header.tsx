import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {LanguageSelector} from "../Common/LanguageSelector";
import { HelpDropdown } from "../Common/HelpDropdown";
import {GiHamburgerMenu} from "react-icons/gi";
import OutsideClickHandler from 'react-outside-click-handler';
import { RootState } from "../../types/redux";
import { useSelector } from "react-redux";
export const Header: React.FC = () => {

    const language = useSelector((state: RootState) => state.common.language);
    const {t} = useTranslation("PageTemplate");
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header>
        <div data-testid="Header-Container"
                className="fixed top-0 left-0 right-0 bg-iw-background py-7 ">
            <div className="container mx-auto flex justify-between items-center px-4">
                <div data-testid="Header-InjiWeb-Logo-Container" className={"flex flex-row space-x-9 justify-center items-center"}>
                    <div  role="button" tabIndex={0} className={"m-3 sm:hidden"} onMouseDown={() => setIsOpen(open => !open)} onKeyUp={() => setIsOpen(open => !open)}>
                        <GiHamburgerMenu size={32}/>
                    </div>
                    <div role={"button"}
                         tabIndex={0}
                         onMouseDown={() => navigate("/")}
                         onKeyUp={() => navigate("/")}>
                        <img src={require("../../assets/InjiWebLogo.png")}
                             className={"h-13 w-28 scale-150 cursor-pointer"}
                             data-testid="Header-InjiWeb-Logo"
                             alt="Inji Web Logo"/>
                    </div>
                </div>
                <nav>
                    <ul className="flex space-x-10 items-center font-semibold" data-testid="Header-Menu-Elements">
                        <li data-testid="Header-Menu-Home">
                            <div data-testid="Header-Menu-Home-div"
                                 onMouseDown={() => navigate("/") }
                                 onKeyUp={() => navigate("/") }
                                 role="button"
                                 tabIndex={0}
                                 className="text-iw-title cursor-pointer hidden sm:inline-block">{t("Header.home")}</div>
                        </li>
                        <li data-testid="Header-Menu-Help">
                        <div className={" hidden sm:block font-semibold"} data-testid="Header-Menu-Help-div"><HelpDropdown/></div>
                        </li>
                    </ul>
                </nav>
                <div className={"font-semibold"} data-testid="Header-Menu-LanguageSelector"><LanguageSelector/></div>
            </div>
            { isOpen &&
                <OutsideClickHandler onOutsideClick={()=>setIsOpen(false)} >
                    <div className="container sm:hidden mx-auto px-4 flex flex-col justify-start items-start font-semibold"
                         role="button"
                         tabIndex={0}
                         onMouseDown={() => setIsOpen(false)}
                         onBlur={() => setIsOpen(false)}>
                        <div data-testid="Header-Menu-Help"
                             role="button"
                             tabIndex={0}
                             onKeyUp={() => {navigate("/help");setIsOpen(false)}}
                             onMouseDown={() => {navigate("/help");setIsOpen(false)}}
                             className="text-iw-title cursor-pointer py-5 w-full inline-block">
                                {t("Header.help")}
                        </div>
                    </div>
                </OutsideClickHandler>
            }
        </div>
        </header>
    )

}

