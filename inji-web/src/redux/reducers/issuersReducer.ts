import {IssuersReducerActionType} from "../../types/redux";

const initialState = {
    issuers: [],
    filtered_issuers: [],
    selected_issuer: {}
}

const IssuersReducerAction: IssuersReducerActionType = {
    STORE_ISSUERS: "STORE_ISSUERS",
    STORE_FILTERED_ISSUERS: "STORE_FILTERED_ISSUERS",
    STORE_SELECTED_ISSUER: "STORE_SELECTED_ISSUER"
}

export const issuersReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case IssuersReducerAction.STORE_ISSUERS :
            return {
                ...state,
                issuers: action.issuers
            }
        case IssuersReducerAction.STORE_FILTERED_ISSUERS :
            return {
                ...state,
                filtered_issuers: action.issuers
            }
        case IssuersReducerAction.STORE_SELECTED_ISSUER :
            return {
                ...state,
                selected_issuer: action.issuers
            }
        default:
            return state
    }
}

export const storeIssuers = (issuers: any) => {
    return {
        type: "STORE_ISSUERS",
        issuers: issuers
    }
}

export const storeFilteredIssuers = (issuers: any) => {
    return {
        type: "STORE_FILTERED_ISSUERS",
        issuers: issuers
    }
}

export const storeSelectedIssuer = (issuer: any) => {
    return {
        type: "STORE_SELECTED_ISSUER",
        issuers: issuer
    }
}

