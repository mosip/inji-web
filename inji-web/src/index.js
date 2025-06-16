import React from "react";
import ReactDOM from "react-dom/client";
import {AppRouter} from "./Router";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "../src/utils/i18n";
import {Provider} from "react-redux";
import {reduxStore} from "./redux/reduxStore";
import {AppToaster} from "./components/Common/toast/AppToaster";
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from "react-router-dom";
import {UserProvider} from "./context/User/UserContext";
import {DownloadSessionProvider} from "./context/User/DownloadSessionContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={reduxStore}>
        <CookiesProvider>
            <UserProvider>
                <DownloadSessionProvider>
                    <AppToaster/>
                    <BrowserRouter>
                        <AppRouter/>
                    </BrowserRouter>
                </DownloadSessionProvider>
            </UserProvider>
        </CookiesProvider>
    </Provider>
);
