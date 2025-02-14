import {configureStore} from "@reduxjs/toolkit";
import {issuersReducer} from "./reducers/issuersReducer";
import {credentialsReducer} from "./reducers/credentialsReducer";
import {commonReducer} from "./reducers/commonReducer";

export const reduxStore = configureStore({
    reducer: {
        issuers: issuersReducer,
        credentials: credentialsReducer,
        common: commonReducer
    }
});
