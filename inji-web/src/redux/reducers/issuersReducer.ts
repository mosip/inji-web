import {IssuerObject} from "../../types/data";
import {IssuersReducerActionType} from "../../types/redux";
import {REHYDRATE} from "redux-persist";

const initialState = {
    issuers: [],
    filtered_issuers: [],
    selected_issuer: {} as IssuerObject | undefined
};

const IssuersReducerAction: IssuersReducerActionType = {
    STORE_ISSUERS: "STORE_ISSUERS",
    STORE_FILTERED_ISSUERS: "STORE_FILTERED_ISSUERS",
    STORE_SELECTED_ISSUER: "STORE_SELECTED_ISSUER"
};

export const issuersReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case IssuersReducerAction.STORE_ISSUERS:
            return {
                ...state,
                issuers: action.issuers
            };
        case IssuersReducerAction.STORE_FILTERED_ISSUERS:
            return {
                ...state,
                filtered_issuers: action.issuers
            };
        case IssuersReducerAction.STORE_SELECTED_ISSUER:
            const selectedIssuer = state.issuers.find(
                (issuer) => issuer["issuer_id"] === action.issuerId
            );
            return {
                ...state,
                selected_issuer: selectedIssuer
            };
        case REHYDRATE:
            if (action.payload?.issuers) {
                const res = {
                    ...state,
                    issuers: action.payload.issuers // Merge persisted state (issuers) into Redux state
                };
                return res
            }
            return state;
        default:
            return state;
    }
};

export const storeIssuers = (issuers: any) => {
    return {
        type: "STORE_ISSUERS",
        issuers: issuers
    };
};

export const storeFilteredIssuers = (issuers: any) => {
    return {
        type: "STORE_FILTERED_ISSUERS",
        issuers: issuers
    };
};

export const storeSelectedIssuer = (issuerId: any) => {
    return {
        type: "STORE_SELECTED_ISSUER",
        issuerId: issuerId
    };
};
