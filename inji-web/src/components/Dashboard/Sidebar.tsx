import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";

type SidebarItemProps = {
    icon: React.ReactNode;
    text: string;
    path: string;
    isActive: boolean;
    isCollapsed: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({
    icon,
    text,
    path,
    isActive,
    isCollapsed
}) => {
    const navigate = useNavigate();

    const itemPaddingLeft = isCollapsed ? "pl-2" : "pl-4";
    const iconContainerMarginLeft = isCollapsed ? "ml-2" : "ml-4";
    const iconContainerStyle = {marginLeft: "-2px"};

    return (
        <div
            className={`relative flex items-center w-full h-12 cursor-pointer transition-all duration-200 rounded-lg ${itemPaddingLeft} pr-2`}
            onClick={() => navigate(path)}
        >
            <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${iconContainerMarginLeft} bg-white shadow-[0_-0.5px_4px_-1px_rgba(0,0,0,0.078),_0_4px_4px_-1px_rgba(0,0,0,0.078)]`}
                style={iconContainerStyle}
            >
                {icon}
            </div>

            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#2B011C] rounded-r-md" />
            )}

            {!isCollapsed && (
                <span
                    className={`ml-3 font-medium text-sm ${
                        isActive ? "text-[#2B011C]" : "text-[#6F6F6F]"
                    } flex-1 truncate`}
                >
                    {text}
                </span>
            )}
        </div>
    );
};

export const Sidebar: React.FC = () => {
    const {t} = useTranslation("Dashboard");
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const getIconColor = (path: string) => {
        return location.pathname === path ? "#2B011C" : "currentColor";
    };

    const sidebarItems = [
        {
            icon: (
                <svg
                    width="24"
                    height="24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
                        stroke={getIconColor("/dashboard/home")}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            text: t("Home.title"),
            path: "/dashboard/home"
        },
        {
            icon: (
                <svg
                    width="24"
                    height="24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                        stroke={getIconColor("/dashboard/credentials")}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            text: t("StoredCredentials.title"),
            path: "/dashboard/credentials"
        }
    ];

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                alignContent: "flex-start"
            }}
            className={`${
                isCollapsed ? "w-24" : "w-64"
            } bg-white h-full transition-all duration-300 border-r border-gray-100 flex flex-col items-start relative`} // Added relative for absolute positioning of button
        >
            {/* Collapse button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-4 right-[-10px] bg-white rounded-full border-2 border-[#2B011C] text-[#2B011C] p-2 focus:outline-none focus:ring-[#2B011C] shadow-md z-10"
                style={{right: isCollapsed ? "-2px" : "-10px"}} // Adjust right position based on collapsed state
            >
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transform ${
                        isCollapsed ? "" : "rotate-180"
                    } transition-transform duration-300`}
                >
                    <path
                        d="M9 19l7-7-7-7"
                        stroke="#2B011C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <div className="flex flex-col space-y-2 mt-2 w-full px-4">
                {sidebarItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        text={item.text}
                        path={item.path}
                        isActive={location.pathname === item.path}
                        isCollapsed={isCollapsed}
                    />
                ))}
            </div>
        </div>
    );
};
