import {CredentialsReducerActionType} from "../../types/redux";

const initialState = {
    credentials: [],
    filtered_credentials: []
}

const CredentialsReducerAction: CredentialsReducerActionType = {
    STORE_CREDENTIAL: 'STORE_CREDENTIAL',
    STORE_FILTERED_CREDENTIALS: 'STORE_FILTERED_CREDENTIALS'
}

export const credentialsReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case CredentialsReducerAction.STORE_CREDENTIAL :
            return {
                ...state,
                credentials: action.credentials
            }
        case CredentialsReducerAction.STORE_FILTERED_CREDENTIALS :
            return {
                ...state,
                filtered_credentials: action.filtered_credentials
            }
        default :
            return state;
    }
}

export const storeCredentials = (credentials: any) => {
    return {
        type: CredentialsReducerAction.STORE_CREDENTIAL,
        credentials: credentials
    }
}

export const storeFilteredCredentials = (credentials: any) => {
    return {
        type: CredentialsReducerAction.STORE_FILTERED_CREDENTIALS,
        filtered_credentials: credentials
    }
}
