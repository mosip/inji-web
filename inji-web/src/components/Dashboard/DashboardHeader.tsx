import React, {useState, useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {LanguageSelector} from "../Common/LanguageSelector";
import {api} from "../../utils/api";
import {useCookies} from "react-cookie";
import {toast} from "react-toastify";
import {RiArrowDownSFill, RiArrowUpSFill} from "react-icons/ri";
import {GradientWrapper} from "../Common/GradientWrapper";
import {
    convertStringIntoPascalCase,
    getProfileInitials
} from "../../pages/Dashboard/utils";
import {useUser} from "../../hooks/useUser";

export const DashboardHeader: React.FC = () => {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState<string | undefined>(
        undefined
    );
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [cookies] = useCookies(["XSRF-TOKEN"]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const {user, removeUser} = useUser();
    const displayNameFromLocalStorage = user?.displayName;
    const hasProfilePictureUrl = user?.profilePictureUrl;

    useEffect(() => {
        setDisplayName(displayNameFromLocalStorage);
    }, [displayNameFromLocalStorage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            const apiRequest = api.userLogout;
            const response = await fetch(apiRequest.url(), {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-XSRF-TOKEN": cookies["XSRF-TOKEN"]
                }
            });

            if (response.ok) {
                removeUser();
                localStorage.removeItem("walletId");
                window.location.replace("/");
            } else {
                const parsedResponse = await response.json();
                const errorCode = parsedResponse?.errors[0].errorCode;
                if (errorCode === "user_logout_error") {
                    removeUser();
                    window.location.replace("/login");
                }
                throw new Error(parsedResponse?.errors[0]?.errorMessage);
            }
        } catch (error) {
            console.error("Logout failed with error:", error);
            toast.error("Unable to logout. Please try again.");
        }
    };

    const dropdownItems: DropdownItem[] = [
        {
            label: "Profile",
            onClick: () => {
                setIsProfileDropdownOpen(false);
                navigate("profile");
            },
            textColor: "text-gray-700"
        },
        {
            label: "FAQ",
            onClick: () => {
                setIsProfileDropdownOpen(false);
                navigate("faq", {state: {from: window.location.pathname}});
            },
            textColor: "text-gray-700"
        },
        {
            label: "Logout",
            onClick: handleLogout,
            textColor: "text-red-700"
        }
    ];

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    return (
        <header className="bg-transparent shadow-[0_4px_5px_0_rgba(0,0,0,0.051)] z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <img
                        src={require("../../assets/InjiWebLogo.png")}
                        className="h-13 w-28 scale-150 cursor-pointer"
                        alt="Inji Web Logo"
                        onClick={() => navigate("/")}
                    />
                </div>

                <div className="flex items-center space-x-6">
                    <LanguageSelector />

                    <div className="relative" ref={dropdownRef}>
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={toggleProfileDropdown}
                        >
                            <div
                                className={`aspect-square w-12 sm:w-13 md:w-14 rounded-full bg-[#DDDDDD] overflow-hidden flex items-center justify-center text-[#1A001D] font-medium text-lg ${
                                    !hasProfilePictureUrl
                                        ? "p-2 sm:p-3 md:p-4"
                                        : ""
                                }`}
                            >
                                {hasProfilePictureUrl ? (
                                    <img
                                        src={user.profilePictureUrl}
                                        alt="Profile Pic"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    getProfileInitials(displayName)
                                )}
                            </div>
                            <span className="font-medium text-gray-800">
                                {convertStringIntoPascalCase(displayName)}
                            </span>

                            {/* Dropdown arrow */}
                            <div className="relative inline-block">
                                {isProfileDropdownOpen ? (
                                    <GradientWrapper>
                                        <RiArrowUpSFill
                                            size={20}
                                            color={
                                                "var(--iw-color-languageArrowIcon)"
                                            }
                                        />
                                    </GradientWrapper>
                                ) : (
                                    <GradientWrapper>
                                        <RiArrowDownSFill
                                            size={20}
                                            color={
                                                "var(--iw-color-languageArrowIcon)"
                                            }
                                        />
                                    </GradientWrapper>
                                )}
                            </div>
                        </div>

                        {/* Profile dropdown */}
                        {isProfileDropdownOpen && (
                            <div className="absolute -right-7 top-100 mt-8 w-56 bg-white rounded-lg shadow-lg z-50">
                                <div className="absolute top-[-0.3rem] right-8 w-3 h-3 bg-white transform rotate-45" />
                                <div className="py-2">
                                    {dropdownItems.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <div
                                                className={`px-4 py-2 text-sm ${item.textColor} hover:bg-gray-100 cursor-pointer`}
                                                onClick={item.onClick}
                                            >
                                                {item.label}
                                            </div>
                                            {index !==
                                                dropdownItems.length - 1 && (
                                                <hr className="border-gray-200 my-1 mx-2" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

type DropdownItem = {
    label: string;
    onClick: () => void;
    textColor: string;
};
