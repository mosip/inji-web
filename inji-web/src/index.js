import React from "react";
import ReactDOM from "react-dom/client";
import {AppRouter} from "./Router";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "../src/utils/i18n";
import {Provider} from "react-redux";
import {reduxStore} from "./redux/reduxStore";
import {AppToaster} from "./components/Common/AppToaster";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={reduxStore}>
        <AppToaster />
        <AppRouter />
    </Provider>
);
