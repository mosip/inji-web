import React from "react";
import {Sidebar} from "./Sidebar";
import {DashboardHeader} from "./DashboardHeader";
import {Footer} from "../PageTemplate/Footer";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux";
import {getDirCurrentLanguage} from "../../utils/i18n";
import {Outlet} from "react-router-dom";

export const DashboardLayout: React.FC = () => {
    const language = useSelector((state: RootState) => state.common.language);

    return (
        <div
            className="h-screen flex flex-col bg-iw-background font-base overflow-hidden"
            dir={getDirCurrentLanguage(language)}
        >
            <DashboardHeader />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 bg overflow-y-auto -mt-1">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <Outlet />
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};
