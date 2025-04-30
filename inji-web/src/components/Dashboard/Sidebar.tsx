import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

type SidebarItemProps = {
  icon: React.ReactNode;
  text: string;
  path: string;
  isActive: boolean;
  isCollapsed: boolean;
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, path, isActive, isCollapsed }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex items-center ${isCollapsed ? 'justify-center h-12 w-12 mx-auto' : 'p-2 sm:p-4'} cursor-pointer ${
        isActive
          ? "bg-white shadow-md rounded-lg relative"
          : "text-[#6F6F6F] hover:bg-gray-100 rounded-lg"
      }`}
      onClick={() => navigate(path)}
    >
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2B011C] rounded-l-lg"></div>
      )}
      <div className={`${isCollapsed ? "" : "mr-3"} ${isActive ? "text-[#2B011C]" : "text-[#6F6F6F]"}`}>
        {icon}
      </div>
      {!isCollapsed && (
        <span className={`${isActive ? "font-medium text-[#2B011C]" : "font-medium"}`}>
          {text}
        </span>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const { t } = useTranslation("Dashboard");
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Define sidebar items with their icons, text, and paths
  const sidebarItems = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      text: "Home",
      path: "/",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      text: "Stored Credentials",
      path: "/view/wallet/credentials",
    },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white h-full transition-all duration-300 relative border-r border-gray-100`}>
      {/* Collapse toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white rounded-full p-1 shadow-md z-10"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform ${isCollapsed ? 'rotate-180' : ''} transition-transform duration-300`}
        >
          <path
            d="M15 19l-7-7 7-7"
            stroke="#6F6F6F"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className={`mt-4 sm:mt-8 ${isCollapsed ? 'px-2 flex flex-col items-center' : 'px-2 sm:px-4 space-y-2'}`}>
        {sidebarItems.map((item, index) => (
          <SidebarItem
            key={index}
            icon={item.icon}
            text={item.text}
            path={item.path}
            isActive={location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard')}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </div>
  );
};
