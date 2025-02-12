import ReactDOM from "react-dom/client";
import {AppRouter} from "./Router";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import "../src/utils/i18n";
import {Provider} from "react-redux";
import {persistor, reduxStore} from "./redux/reduxStore";
import {AppToaster} from "./components/Common/AppToaster";
import {PersistGate} from "redux-persist/integration/react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={reduxStore}>
        <PersistGate loading={null} persistor={persistor}>
            <AppToaster />
            <AppRouter />
        </PersistGate>
    </Provider>
);
