import {storage} from "../../utils/storage";
import {CommonReducerActionType} from "../../types/redux";
import {defaultLanguage} from "../../utils/i18n";

const initialState = {
    language: storage.getItem(storage.SELECTED_LANGUAGE) ? storage.getItem(storage.SELECTED_LANGUAGE) : defaultLanguage,
    vcExpiryTimes: 1
}

const CommonReducerAction: CommonReducerActionType = {
    STORE_LANGUAGE: 'STORE_LANGUAGE',
    STORE_VC_EXPIRY_TIMES: 'STORE_VC_EXPIRY_TIMES'
}

export const commonReducer = (state = initialState, actions: any) => {
    switch (actions.type) {
        case CommonReducerAction.STORE_LANGUAGE: {
            return {
                ...state,
                language: actions.language
            }
        }
        case CommonReducerAction.STORE_VC_EXPIRY_TIMES: {
            return {
                ...state,
                vcExpiryTimes: actions.vcExpiryTimes
            }
        }
        default :
            return state;
    }
}

export const storeLanguage = (language: string) => {
    return {
        type: CommonReducerAction.STORE_LANGUAGE,
        language: language
    }
}

export const storeVCExpiryTimes = (vcExpiryTimes: number) => {
    return {
        type: CommonReducerAction.STORE_VC_EXPIRY_TIMES,
        vcExpiryTimes: vcExpiryTimes
    }
}


