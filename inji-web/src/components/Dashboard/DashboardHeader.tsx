import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LanguageSelector } from "../Common/LanguageSelector";
import { useSelector } from "react-redux";
import { RootState } from "../../types/redux";
import { api } from "../../utils/api";
import { useCookies } from 'react-cookie';
import { toast } from "react-toastify";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { GradientWrapper } from "../Common/GradientWrapper";

export const DashboardHeader: React.FC = () => {
  const language = useSelector((state: RootState) => state.common.language);
  const { t } = useTranslation("Dashboard");
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [cookies] = useCookies(['XSRF-TOKEN']);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayName(localStorage.getItem("displayName"));
  }, [localStorage.getItem("displayName")]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
          'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
        },
      });

      if (response.ok) {
        localStorage.removeItem("displayName");
        localStorage.removeItem("walletId");
        toast.success("You have been successfully logged out.");
        setTimeout(() => {
          window.location.replace("/");
        }, 1500); // Give time for the toast to be visible
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
      toast.error("Unable to logout. Please try again.");
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <header className="bg-transparent">
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
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-iw-primary to-iw-secondary flex items-center justify-center text-white font-medium text-sm">
                {displayName ? displayName.split(' ').map(name => name.charAt(0).toUpperCase()).join('') : "U"}
              </div>
              <span className="font-medium text-gray-800">{displayName || "User"}</span>

              {/* Dropdown arrow */}
              <div className="relative inline-block">
                {isProfileDropdownOpen ? (
                  <GradientWrapper>
                    <RiArrowUpSFill size={20} color={'var(--iw-color-languageArrowIcon)'} />
                  </GradientWrapper>
                ) : (
                  <GradientWrapper>
                    <RiArrowDownSFill size={20} color={'var(--iw-color-languageArrowIcon)'} />
                  </GradientWrapper>
                )}
              </div>
            </div>

            {/* Profile dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <div
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </div>
                  <div
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    FAQ
                  </div>
                  <div
                    className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
