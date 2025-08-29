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
    const {isUserLoggedIn, fetchUserProfile} = useUser()

    useEffect(() => {
        async function fetchIssuers() {
            const apiRequest: ApiRequest = api.fetchIssuers;
            const {data: response, state: issuerResponseState} = await fetchData(
                {
                    apiConfig: apiRequest,
                }
            );
            if (issuerResponseState === RequestStatus.ERROR) {
                toast.error(t("errorContent"));
                return
            }

            const ignoredIssuersFromRendering = window._env_.IGNORED_ISSUER_IDS.split(",");
            const issuers = response?.response?.issuers.filter(
                (issuer: IssuerObject) =>
                    // Excludes issuers with protocol 'OTP' and those whose issuer_id is in the ignoredIssuersFromRendering list (or contains any ignored issuer id as a substring).
                    issuer.protocol !== 'OTP' &&
                    !ignoredIssuersFromRendering.some((ignoredIssuer) =>
                        issuer.issuer_id.includes(ignoredIssuer)
                    )
            );

            dispatch(storeFilteredIssuers(issuers));
            dispatch(storeIssuers(issuers));
        }

        const initializeIssuersData = async () => {
            if (isUserLoggedIn()) {
                try {
                    await fetchUserProfile();
                    await fetchIssuers();
                } catch (error: any) {
                    console.error("Error fetching user profile:", error);
                    toast.error(t("errorContent"));
                }
            } else {
                await fetchIssuers();
            }
        };

        void initializeIssuersData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
