import {BrowserRouter, Route, Routes} from "react-router-dom";
import React from "react";
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

export const AppRouter = () => {
    const language = useSelector((state: RootState) => state.common.language);
    const wrapElement = (element: JSX.Element, isBGNeeded: boolean = true) => {
        return <React.Fragment>
            <div className={!isBGNeeded ? `h-screen min-h-72 bg-iw-background font-base` : `h-screen min-h-72 bg bg-iw-background font-base` } dir={getDirCurrentLanguage(language)}>
                <Header/>
                <div className={"top-20 h-full mt-20 my-auto flex-grow"}>
                    {element}
                </div>
                <Footer/>
            </div>
        </React.Fragment>
    }

    return (<BrowserRouter>
        <Routes>
            <Route path="/" element={wrapElement(<HomePage/>, false)}/>
            <Route path="/issuers" element={wrapElement(<IssuersPage/>)}/>
            <Route path="/issuers/:issuerId" element={wrapElement(<CredentialsPage/>)}/>
            <Route path="/help" element={wrapElement(<HelpPage/>)}/>
            <Route path="/redirect" element={wrapElement(<RedirectionPage/>)}/>
            <Route path="/authorize" element={wrapElement(<AuthorizationPage/>)}/>
            <Route path="/*" element={wrapElement(<PageNotFound/>)}/>
        </Routes>
    </BrowserRouter>)
}


