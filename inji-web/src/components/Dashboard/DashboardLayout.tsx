import React from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { Footer } from "../PageTemplate/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../../types/redux";
import { getDirCurrentLanguage } from "../../utils/i18n";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const language = useSelector((state: RootState) => state.common.language);

  return (
    <div
      className="h-screen flex flex-col bg-iw-background font-base overflow-hidden"
      dir={getDirCurrentLanguage(language)}
    >
      <DashboardHeader />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-dashboard -z-10"></div>
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
