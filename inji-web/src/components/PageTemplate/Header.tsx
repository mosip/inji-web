import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "../Common/LanguageSelector";
import { HelpDropdown } from "../Common/HelpDropdown";
import { GiHamburgerMenu } from "react-icons/gi";
import OutsideClickHandler from 'react-outside-click-handler';
import { RootState } from "../../types/redux";
import { useSelector } from "react-redux";
import { isRTL } from "../../utils/i18n";
import { api } from "../../utils/api";
import { useCookies } from 'react-cookie';


export const Header: React.FC = () => {
    const language = useSelector((state: RootState) => state.common.language);
    const { t, i18n } = useTranslation("PageTemplate");
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [cookies] = useCookies(['XSRF-TOKEN']);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem("displayName"));
        };

        window.addEventListener("displayNameUpdated", handleStorageChange);

        return () => {
            window.removeEventListener(
                "displayNameUpdated",
                handleStorageChange
            );
        };
    }, []);

    const handleAuthAction = async () => {
        if (isLoggedIn) {
            try {
                const apiRequest = api.userLogout;
                const response = await fetch(apiRequest.url(), {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
                    },
                });

                if (response.ok) {
                    localStorage.removeItem("displayName");
                    window.location.replace("/");
                } else {
                    const parsedResponse = await response.json();

                    const errorMessage = parsedResponse?.errors[0].errorMessage;
                    if (
                        errorMessage ===
                        "Logout request was sent for an invalid or expired session"
                    ) {
                        localStorage.removeItem("displayName");
                        window.location.replace("/login");
                    }
                    throw new Error(parsedResponse?.errors[0]?.errorMessage);
                }
            } catch (error) {
                console.error("Logout failed with error:", error);
            }
        } else {
            navigate("/login");
        }
    };

    return (
        <header>
            <div
                data-testid="Header-Container"
                className="fixed top-0 left-0 right-0 bg-iw-background py-7 z-10"
            >
                <div className="container mx-auto flex justify-between items-center px-4">
                    <div
                        data-testid="Header-InjiWeb-Logo-Container"
                        className={`flex flex-row ${
                            isRTL(language) ? "space-x-reverse" : "space-x-9"
                        } justify-center items-center`}
                    >
                        <div
                            role="button"
                            tabIndex={0}
                            className={`m-3 sm:hidden ${
                                isRTL(language) ? "ml-4" : ""
                            }`}
                            onMouseDown={() => setIsOpen((open) => !open)}
                            onKeyUp={() => setIsOpen((open) => !open)}
                        >
                            <GiHamburgerMenu size={32} />
                        </div>
                        <div
                            role={"button"}
                            tabIndex={0}
                            onMouseDown={() => navigate("/")}
                            onKeyUp={() => navigate("/")}
                        >
                            <img
                                src={require("../../assets/InjiWebLogo.png")}
                                className={`h-13 w-28 scale-150 cursor-pointer ${
                                    isRTL(language) ? "mr-4" : ""
                                }`}
                                data-testid="Header-InjiWeb-Logo"
                                alt="Inji Web Logo"
                            />
                        </div>
                    </div>
                    <nav>
                        <ul
                            className="flex space-x-10 items-center font-semibold"
                            data-testid="Header-Menu-Elements"
                        >
                            <li data-testid="Header-Menu-Home">
                                <div
                                    data-testid="Header-Menu-Home-div"
                                    onMouseDown={() => navigate("/")}
                                    onKeyUp={() => navigate("/")}
                                    role="button"
                                    tabIndex={0}
                                    className="text-iw-title cursor-pointer hidden sm:inline-block"
                                >
                                    {t("Header.home")}
                                </div>
                            </li>
                            <li data-testid="Header-Menu-Help">
                                <div
                                    className={" hidden sm:block font-semibold"}
                                    data-testid="Header-Menu-Help-div"
                                >
                                    <HelpDropdown />
                                </div>
                            </li>
                            <li data-testid="Header-Menu-Auth">
                                <div
                                    data-testid="Header-Menu-Auth-div"
                                    onMouseDown={handleAuthAction}
                                    onKeyUp={handleAuthAction}
                                    role="button"
                                    tabIndex={0}
                                    className="text-iw-title cursor-pointer hidden sm:inline-block"
                                >
                                    {isLoggedIn
                                        ? t("Header.logout")
                                        : t("Header.login")}
                                </div>
                            </li>
                            {isLoggedIn && (
                                <li data-testid="Header-Menu-View-Credentials">
                                    <div
                                        data-testid="Header-Menu-View-Credentials-div"
                                        onMouseDown={() =>
                                            navigate("/view/wallet/credentials")
                                        }
                                        onKeyUp={() =>
                                            navigate("/view/wallet/credentials")
                                        }
                                        role="button"
                                        tabIndex={0}
                                        className="text-iw-title cursor-pointer hidden sm:inline-block"
                                    >
                                        {"Credentials"}
                                    </div>
                                </li>
                            )}
                        </ul>
                    </nav>
                    <div
                        className={"font-semibold"}
                        data-testid="Header-Menu-LanguageSelector"
                    >
                        <LanguageSelector />
                    </div>
                </div>
                {isOpen && (
                    <OutsideClickHandler
                        onOutsideClick={() => setIsOpen(false)}
                    >
                        <div
                            className="container sm:hidden mx-auto px-4 flex flex-col justify-start items-start font-semibold"
                            role="button"
                            tabIndex={0}
                            onMouseDown={() => setIsOpen(false)}
                            onBlur={() => setIsOpen(false)}
                        >
                            <div
                                data-testid="Header-Menu-Help"
                                role="button"
                                tabIndex={0}
                                onKeyUp={() => {
                                    navigate("/help");
                                    setIsOpen(false);
                                }}
                                onMouseDown={() => {
                                    navigate("/help");
                                    setIsOpen(false);
                                }}
                                className="text-iw-title cursor-pointer py-5 w-full inline-block"
                            >
                                {t("Header.help")}
                            </div>
                        </div>
                    </OutsideClickHandler>
                )}
            </div>
        </header>
    );
};
