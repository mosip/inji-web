import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {IssuersPage} from "./pages/IssuersPage";
import {Header} from "./components/PageTemplate/Header";
import {Footer} from "./components/PageTemplate/Footer";
import {HelpPage} from "./pages/HelpPage";
import {CredentialsPage} from "./pages/CredentialsPage";
import {RedirectionPage} from "./pages/RedirectionPage";
import {useSelector} from "react-redux";
import {RootState} from "./types/redux";
import {getDirCurrentLanguage} from "./utils/i18n";
import {PageNotFound} from "./pages/PageNotFound";
import {AuthorizationPage} from "./pages/AuthorizationPage";
import {HomePage} from "./pages/HomePage";
import Login from "./pages/users/login/Login";
import LoginSessionStatusChecker from "./pages/users/login/LoginSessionStatusChecker";
import PinForm from "./pages/users/PinPage";
import WalletCredentialsPage from "./pages/users/login/WalletCredentialsPage";
import {DashboardLayout} from "./components/Dashboard/DashboardLayout";
import {HomePage as DashboardHomePage} from "./pages/Dashboard/HomePage";
import {DocumentsPage} from "./pages/Dashboard/DocumentsPage";
import { useUser } from "./hooks/useUser";

export const AppRouter = () => {
    const language = useSelector((state: RootState) => state.common.language);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const {user} = useUser();

    useEffect(() => {
        const handleStorageChange = () => {
            const hasDisplayName = !!user?.displayName;
            const hasWalletId = !!localStorage.getItem("walletId");
            setIsLoggedIn(hasDisplayName && hasWalletId);
        };

        // Initial check
        handleStorageChange();

        window.addEventListener("displayNameUpdated", handleStorageChange);
        return () => {
            window.removeEventListener("displayNameUpdated", handleStorageChange);
        };
    }, []);

    const wrapElement = (element: JSX.Element, isBGNeeded: boolean = true) => {
        return (
            <React.Fragment>
                <div
                    className={
                        !isBGNeeded
                            ? `h-screen min-h-72 bg-iw-background font-base`
                            : `h-screen min-h-72 bg bg-iw-background font-base`
                    }
                    dir={getDirCurrentLanguage(language)}
                >
                    <Header />
                    <div className={"top-20 h-full mt-20 my-auto flex-grow"}>
                        {element}
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        );
    };

    return (
        <BrowserRouter>
            <LoginSessionStatusChecker />
            <Routes>
                <Route path="/" element={wrapElement(<HomePage />, false)} />
                <Route
                    path="/issuers"
                    element={wrapElement(
                        <IssuersPage className="mt-10 mb-20" />
                    )}
                />
                <Route
                    path="/issuers/:issuerId"
                    element={wrapElement(<CredentialsPage />)}
                />
                <Route
                    path="/help"
                    element={wrapElement(<HelpPage backUrl="/" />)}
                />
                <Route
                    path="/redirect"
                    element={wrapElement(<RedirectionPage />)}
                />
                <Route
                    path="/authorize"
                    element={wrapElement(<AuthorizationPage />)}
                />
                <Route path="/login" element={wrapElement(<Login />)} />
                <Route path="/pin" element={wrapElement(<PinForm />)} />
                <Route
                    path="/view/wallet/credentials"
                    element={
                        isLoggedIn
                            ? wrapElement(<DocumentsPage />, false)
                            : wrapElement(<WalletCredentialsPage />, false)
                    }
                />
                <Route path="/*" element={wrapElement(<PageNotFound />)} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route path="home" element={<DashboardHomePage />} />
                    <Route path="credentials" element={<DocumentsPage />} />
                    <Route path="faq" element={<HelpPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
