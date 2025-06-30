import React, {useEffect} from "react";
import {IntroBox} from "../components/Common/IntroBox";
import {SearchIssuer} from "../components/Issuers/SearchIssuer";
import {IssuersList} from "../components/Issuers/IssuersList";
import {useDispatch} from "react-redux";
import {storeFilteredIssuers, storeIssuers} from "../redux/reducers/issuersReducer";
import {api} from "../utils/api";
import {ApiRequest, IssuerObject} from "../types/data";
import {useTranslation} from "react-i18next";
import {toast} from "react-toastify";
import {useApi} from "../hooks/useApi";
import {RequestStatus} from "../utils/constants";
import {useUser} from "../hooks/User/useUser";

export const IssuersPage: React.FC<IssuerPageProps> = ({className}) => {
    const {state, fetchData} = useApi();
    const dispatch = useDispatch();
    const {t} = useTranslation("IssuersPage");
    const {isUserLoggedIn, fetchUserProfile, error: fetchUserProfileError} = useUser()

    useEffect(() => {
        async function fetchIssuers() {
            const apiRequest: ApiRequest = api.fetchIssuers;
            const {data: response} = await fetchData(
                {
                    apiConfig: apiRequest,
                }
            );
            if(!response)
                return
            const issuers = response?.response?.issuers.filter(
                (issuer: IssuerObject) => issuer.protocol !== "OTP"
            );
            dispatch(storeFilteredIssuers(issuers));
            dispatch(storeIssuers(issuers));
        }

        const initializeIssuersData = async () => {
            if(isUserLoggedIn()){
                fetchUserProfile().then(async () => {
                    await fetchIssuers();
                }).catch((error: any) => {
                    console.error("Error fetching user profile:", error);
                })
            } else {
                await fetchIssuers();
            }
        };

        void initializeIssuersData();
    }, []);

    if (state === RequestStatus.ERROR || fetchUserProfileError) {
        toast.error(t("errorContent"));
    }

    return (
        <div data-testid="Home-Page-Container">
            <div className="container mx-auto mt-8 flex flex-col px-4 sm:px-6 md:px-10 lg:px-20">
                <div className={className}>
                    <IntroBox/>
                    <SearchIssuer/>
                </div>
                <IssuersList state={state}/>
            </div>
        </div>
    );
};

type IssuerPageProps = {
    className?: string;
};
