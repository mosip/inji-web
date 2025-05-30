import {
    Navigate,
    Route,
    Routes,
    useLocation
} from 'react-router-dom';
import React, {useEffect, useRef, useState} from 'react';
import {IssuersPage} from './pages/IssuersPage';
import {Header} from './components/PageTemplate/Header';
import {Footer} from './components/PageTemplate/Footer';
import {FAQPage} from './pages/FAQPage';
import {CredentialsPage} from './pages/CredentialsPage';
import {RedirectionPage} from './pages/RedirectionPage';
import {useSelector} from 'react-redux';
import {RootState} from './types/redux';
import {getDirCurrentLanguage} from './utils/i18n';
import {PageNotFound} from './pages/PageNotFound';
import {AuthorizationPage} from './pages/AuthorizationPage';
import {HomePage} from './pages/HomePage';
import LoginSessionStatusChecker from './pages/users/login/LoginSessionStatusChecker';
import PinForm from './pages/users/PinPage';
import WalletCredentialsPage from './pages/users/login/WalletCredentialsPage';
import {Layout} from './components/Dashboard/Layout';
import {HomePage as DashboardHomePage} from './pages/Dashboard/HomePage';
import {StoredCredentialsPage} from './pages/Dashboard/StoredCredentialsPage';
import {useUser} from './hooks/useUser';
import {CredentialTypesPage} from './pages/Dashboard/CredentialTypesPage';
import { ProfilePage } from './pages/Dashboard/ProfilePage';

export const AppRouter = () => {
    const location = useLocation();
    const language = useSelector((state: RootState) => state.common.language);
    const {user, walletId} = useUser();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const [headerHeight, setHeaderHeight] = useState(0);
    const [footerHeight, setFooterHeight] = useState(0);

    const getHeaderFooterHeights = () => {
        return {
            headerHeight:
                headerRef.current?.getBoundingClientRect().height || 0,
            footerHeight: footerRef.current?.getBoundingClientRect().height || 0
        };
    };

    useEffect(() => {
        const updateHeights = () => {
            const {headerHeight, footerHeight} = getHeaderFooterHeights();
            setHeaderHeight(headerHeight);
            setFooterHeight(footerHeight);
        };

        updateHeights();

        window.addEventListener('resize', updateHeights);
        return () => {
            window.removeEventListener('resize', updateHeights);
        };
    }, [location.pathname]);

    useEffect(() => {
        const updateLoginState = () => {
            setIsLoggedIn(!!user && !!walletId);
        };

        updateLoginState();
    }, [user, walletId]);

    const wrapElement = (element: JSX.Element, isBGNeeded: boolean = true) => {
        return (
            <div
                className={`flex flex-col h-screen ${
                    !isBGNeeded ? 'bg-iw-background' : 'bg bg-iw-background'
                } font-base`}
                dir={getDirCurrentLanguage(language)}
            >
                <Header headerRef={headerRef} />
                <div
                    className="flex-grow overflow-y-auto"
                    style={{
                        marginTop: headerHeight,
                        marginBottom: footerHeight
                    }}
                >
                    {element}
                </div>
                <Footer footerRef={footerRef} />
            </div>
        );
    };

    return (
        <>
            <LoginSessionStatusChecker />
            <Routes>
                <Route
                    path="/"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/dashboard/home" replace />
                        ) : (
                            wrapElement(<HomePage />, false)
                        )
                    }
                />
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
                    path="/faq"
                    element={wrapElement(<FAQPage backUrl="/" />)}
                />
                <Route
                    path="/redirect"
                    element={wrapElement(<RedirectionPage />)}
                />
                <Route
                    path="/authorize"
                    element={wrapElement(<AuthorizationPage />)}
                />
                <Route path="/pin" element={wrapElement(<PinForm />)} />
                {/*TODO: StoredCredentials page is already showing wallet's credentials, do we need this*/}
                {/*TODO: Remove the component and router*/}
                <Route
                    path="/view/wallet/credentials"
                    element={wrapElement(<WalletCredentialsPage />, false)}
                />
                <Route path="/*" element={wrapElement(<PageNotFound />)} />
                <Route path="/dashboard" element={<Layout />}>
                    <Route path="home" element={<DashboardHomePage />} />
                    <Route
                        path="issuers/:issuerId"
                        element={<CredentialTypesPage backUrl='/dashboard/home' />}
                    />
                    <Route path="credentials" element={<StoredCredentialsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="faq" element={<FAQPage withHome={true} />} />
                </Route>
            </Routes>
        </>
    );
};
