import React, {useEffect} from "react";
import {RequestStatus, useFetch} from "../hooks/useFetch";
import {IntroBox} from "../components/Common/IntroBox";
import {SearchIssuer} from "../components/Issuers/SearchIssuer";
import {IssuersList} from "../components/Issuers/IssuersList";
import {useDispatch} from "react-redux";
import {storeFilteredIssuers, storeIssuers} from "../redux/reducers/issuersReducer";
import {api} from "../utils/api";
import {ApiRequest, IssuerObject} from "../types/data";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";

export const IssuersPage: React.FC = () => {

    const {state, fetchRequest} = useFetch();
    const dispatch = useDispatch();
    const {t} = useTranslation("IssuersPage");

    useEffect(() => {
        const fetchCall = async () => {
            const apiRequest: ApiRequest = api.fetchIssuers;
            const response = await fetchRequest(
                apiRequest.url(),
                apiRequest.methodType,
                apiRequest.headers()
            );
            const issuers = response?.response?.issuers.filter((issuer: IssuerObject) => issuer.protocol !== "OTP")
            dispatch(storeFilteredIssuers(issuers));
            dispatch(storeIssuers(issuers));
        }
        fetchCall();
    }, [])

    if (state === RequestStatus.ERROR) {
        toast.error(t("errorContent"));
    }
    return <div data-testid="Home-Page-Container">
        <div className="container mx-auto mt-8 flex flex-col px-10">
            <div className={"mb-20"}>
                <IntroBox/>
                <SearchIssuer state={state} fetchRequest={fetchRequest}/>
            </div>
            <IssuersList state={state}/>
        </div>

    </div>

}
