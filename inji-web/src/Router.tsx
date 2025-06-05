import {Navigate, Route, Routes, useLocation} from 'react-router-dom';
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
import {PasscodePage} from './pages/User/PasscodePage';
import {Layout} from './components/Dashboard/Layout';
import {HomePage as DashboardHomePage} from './pages/User/HomePage';
import {StoredCardsPage} from './pages/User/StoredCards/StoredCardsPage';
import {useUser} from './hooks/useUser';
import {CredentialTypesPage} from './pages/User/CredentialTypesPage';
import {ResetWalletPage} from './pages/users/ResetWalletPage';
import {ProfilePage} from './pages/User/ProfilePage';
import {Pages, ROUTES} from "./constants/Routes";

function RedirectToUserHome() {
    return <Navigate to={ROUTES.USER_HOME} replace/>;
}

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
                headerRef.current?.getBoundingClientRect().height ?? 0,
            footerHeight: footerRef.current?.getBoundingClientRect().height ?? 0
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
                <Header headerRef={headerRef}/>
                <div
                    className="flex-grow overflow-y-auto"
                    style={{
                        marginTop: headerHeight,
                        marginBottom: footerHeight
                    }}
                >
                    {element}
                </div>
                <Footer footerRef={footerRef}/>
            </div>
        );
    };

    return (
        <>
            <LoginSessionStatusChecker/>
            <Routes>
                <Route
                    path={ROUTES.ROOT}
                    element={
                        isLoggedIn ? (
                            <RedirectToUserHome/>
                        ) : (
                            wrapElement(<HomePage/>, false)
                        )
                    }
                />
                <Route
                    path={Pages.ISSUERS}
                    element={wrapElement(
                        <IssuersPage className="mt-10 mb-20"/>
                    )}
                />
                <Route
                    path={Pages.ISSUER_TEMPLATE}
                    element={wrapElement(<CredentialsPage/>)}
                />
                <Route
                    path={Pages.FAQ}
                    element={wrapElement(<FAQPage backUrl={ROUTES.ROOT}/>)}
                />
                <Route
                    path={Pages.REDIRECT}
                    element={wrapElement(<RedirectionPage/>)}
                />
                <Route
                    path={Pages.AUTHORIZE}
                    element={wrapElement(<AuthorizationPage/>)}
                />
                <Route path={Pages.USER}>
                    <Route path={Pages.PASSCODE} element={wrapElement(<PasscodePage/>)}/>
                    <Route element={<Layout/>}>
                        <Route path={Pages.ISSUERS} element={<RedirectToUserHome/>}/>
                        <Route path={Pages.HOME} element={<DashboardHomePage/>}/>
                        <Route
                            path={Pages.ISSUER_TEMPLATE}
                            element={
                                <CredentialTypesPage backUrl={ROUTES.USER_HOME}/>
                            }
                        />
                        <Route path={Pages.CREDENTIALS} element={<StoredCardsPage/>}/>
                        <Route path={Pages.PROFILE} element={<ProfilePage/>}/>
                        <Route path={Pages.FAQ} element={<FAQPage withHome={true}/>}/>
                    </Route>
                    <Route
                        path={Pages.RESET_WALLET}
                        element={wrapElement(<ResetWalletPage/>)}
                    />
                </Route>

                <Route path="/*" element={wrapElement(<PageNotFound/>)}/>
            </Routes>
        </>
    );
};
