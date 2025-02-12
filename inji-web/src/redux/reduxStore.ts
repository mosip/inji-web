import {configureStore} from "@reduxjs/toolkit";
import {persistReducer, persistStore, createTransform} from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import {issuersReducer} from "./reducers/issuersReducer";
import {credentialsReducer} from "./reducers/credentialsReducer";
import {commonReducer} from "./reducers/commonReducer";

const issuersPersistConfig = {
    key: "issuers",
    storage: storageSession,
    whitelist: ["issuers"] //  mention issuers reducer field name (issuers) that needs to be persisted
};

const persistedIssuersReducer = persistReducer(
    issuersPersistConfig,
    issuersReducer
);

export const reduxStore = configureStore({
    reducer: {
        issuers: persistedIssuersReducer,
        credentials: credentialsReducer,
        common: commonReducer
    }
});

export const persistor = persistStore(reduxStore);
