import React, {Fragment, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {navigateToDashboardHome} from './utils';
import {NavBackArrowButton} from './NavBackArrowButton';
import {WalletCredential} from "../../types/data";
import {useSelector} from "react-redux";
import {RootState} from "../../types/redux";
import {api} from "../../utils/api";
import {SolidButton} from "../../components/Common/Buttons/SolidButton";
import {SpinningLoader} from "../../components/Common/SpinningLoader";
import {SearchBar} from "../../components/Common/SearchBar";
import {InfoSection} from "../../components/Common/InfoSection";
import {VCCardView} from "../../components/VC/VCCardView";
import {FlatList} from "../../components/Common/List/FlatList";
import {DocumentIcon} from "../../components/Icon/DocumentIcon";
import {PageTitle} from "../../components/Common/PageTitle";

export const StoredCredentialsPage: React.FC = () => {
    const {t} = useTranslation('Dashboard');
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<WalletCredential[]>([]);
    const [filteredCredentials, setFilteredCredentials] = useState<WalletCredential[]>([]);
    const [loading, setLoading] = useState(true);
    const language = useSelector((state: RootState) => state.common.language);
    const [error, setError] = useState({
        code: "",
        message: ""
    });

    const fetchWalletCredentials = async () => {
        try {
            const fetchWalletCredentials = api.fetchWalletVCs;
            const response = await fetch(fetchWalletCredentials.url(), {
                method: "GET",
                headers: fetchWalletCredentials.headers(language),
                credentials: "include"
            });

            const responseData = await response.json();
            if (response.ok) {
                setCredentials(responseData);
                setFilteredCredentials(responseData)
            } else {
                setError({
                    code: "Fetching Credentials Failed",
                    message: responseData.errorMessage
                });
                throw new Error(responseData.errorMessage);
            }
        } catch (error) {
            console.error("Failed to fetch credentials:", error);
            setError({
                code: "Network Error",
                message: "Failed to fetch credentials. Please try again later."
            })
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletCredentials().then(_ => console.debug("Credentials fetched successfully"));
    }, []);

    const preview = (_: WalletCredential) => () => console.log("Preview");

    const filterCredentials = (searchText: string) => {
        if (searchText === "") {
            setFilteredCredentials(credentials);
        } else {
            const filteredCredentialsToBeUpdated = credentials.filter((credential: WalletCredential) =>
                credential.credentialTypeDisplayName.toLowerCase().includes(searchText.toLowerCase())
            )
            setFilteredCredentials(filteredCredentialsToBeUpdated);
        }
    };

    const navigateToHome = () => navigateToDashboardHome(navigate);

    const loader =
        <div className="flex items-center justify-center min-h-screen w-full">
            <SpinningLoader/>
        </div>

    function displayCredentials() {
        if (credentials.length == 0) {
            return <InfoSection title={"No Cards Stored!"}
                                actionText={"You haven't downloaded any credentials yet. Tap “Add Credential” to get started."}
                                icon={<DocumentIcon/>}
            />;
        }
        return (
            <Fragment>
                <SearchBar
                    placeholder={"Search your documents by Name"}
                    filter={filterCredentials}
                />
                <FlatList
                    onEmpty={<InfoSection actionText={"No cards match your search."}/>}
                    data={filteredCredentials}
                    renderItem={(item: WalletCredential) =>
                        <VCCardView
                            key={item.credentialId}
                            onClick={preview}
                            credential={item}
                        />
                    }
                    numColumns={3}
                    keyExtractor={(credential: WalletCredential) => credential.credentialId}
                    testId={"credentials"}
                />
            </Fragment>
        )
    }

    if(error.code){
        return (
            <div className="container mx-auto sm:px-2 md:px-4 lg:px-6 py-6 relative ml-3 sm:ml-0">
                <div className="text-red-500 text-center">
                    <h2>{t('errorTitle')}</h2>
                    <p>{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto sm:px-2 md:px-4 lg:px-6 py-6 relative ml-3 sm:ml-0 ">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-6 gap-4 sm:gap-0">
                <div className="flex items-start">
                    <div className="flex items-start">
                        <NavBackArrowButton onBackClick={navigateToHome}/>
                    </div>
                    <div className="flex flex-col items-start">
                        <PageTitle value={t('StoredCredentials.title')} testId={"stored-credentials"}/>
                        {/*TODO: use TertiaryButton here*/}
                        <button
                            data-testid={'Home'}
                            className="text-xs sm:text-sm text-[#5B03AD] cursor-pointer"
                            onClick={navigateToHome}
                        >
                            {t('Home.title')}
                        </button>
                    </div>
                </div>
                <div className="hidden sm:block">
                    <SolidButton testId={"add-credential"} onClick={navigateToHome} title={"Add credential"}/>
                </div>
            </div>

            {
                loading ? loader : displayCredentials()
            }
        </div>
    );
};
