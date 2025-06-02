import React, {Fragment, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {navigateToDashboardHome} from '../utils';
import {NavBackArrowButton} from '../NavBackArrowButton';
import {WalletCredential} from "../../../types/data";
import {useSelector} from "react-redux";
import {RootState} from "../../../types/redux";
import {api} from "../../../utils/api";
import {SolidButton} from "../../../components/Common/Buttons/SolidButton";
import {SpinningLoader} from "../../../components/Common/SpinningLoader";
import {SearchBar} from "../../../components/Common/SearchBar/SearchBar";
import {InfoSection} from "../../../components/Common/Info/InfoSection";
import {VCCardView} from "../../../components/VC/VCCardView";
import {FlatList} from "../../../components/Common/List/FlatList";
import {DocumentIcon} from "../../../components/Icon/DocumentIcon";
import {PageTitle} from "../../../components/Common/PageTitle/PageTitle";
import {Error} from "../../../components/Error/Error";
import {BorderedButton} from "../../../components/Common/Buttons/BorderedButton";
import {StoredCardsPageStyles} from "./StoredCardsPageStyles";

export const StoredCardsPage: React.FC = () => {
    const {t} = useTranslation('StoredCards');
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<WalletCredential[]>([]);
    const [filteredCredentials, setFilteredCredentials] = useState<WalletCredential[]>([]);
    const [loading, setLoading] = useState(true);
    const language = useSelector((state: RootState) => state.common.language);
    const [error, setError] = useState({
        code: "",
        message: "Sub-heading goes here..."
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

    const preview = (_: WalletCredential) => console.log("Preview");

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
        <div className={StoredCardsPageStyles.loaderContainer} data-testid={"loader-credentials"}>
            <SpinningLoader/>
        </div>

    function displayCredentials() {
        if (credentials.length === 0) {
            return <InfoSection title={t('emptyScreen.title')}
                                message={t('emptyScreen.actionText')}
                                icon={<DocumentIcon/>}
                                testId={"no-credentials-downloaded"}
            />;
        }
        return (
            <Fragment>
                <div className={"flex justify-between"}>
                    <SearchBar
                        testId={"search-credentials"}
                        placeholder={t('search.placeholder')}
                        filter={filterCredentials}
                    />
                </div>
                <div>
                    <FlatList
                        onEmpty={<InfoSection message={t('search.noResults')} testId={"no-search-cards-found"}/>}
                        data={filteredCredentials}
                        renderItem={(item: WalletCredential) =>
                            <VCCardView
                                key={item.credentialId}
                                onClick={preview}
                                credential={item}
                            />
                        }
                        keyExtractor={(credential: WalletCredential) => credential.credentialId}
                        testId={"credentials"}
                    />
                </div>
            </Fragment>
        )
    }

    const showContent = () => {
        if (loading) {
            return loader;
        }

        if (error.code) {
            return (
                <Error
                    message={error.code}
                    helpText={error.message}
                    testId={"stored-credentials"}
                    action={<BorderedButton testId={"btn-go-home"} onClick={navigateToHome}
                                            title={t('Common:goToHome')}/>}
                />
            );
        }

        return displayCredentials();
    };

    return (
        <div className={StoredCardsPageStyles.container}>
            <div className={StoredCardsPageStyles.headerContainer}>
                <div className={StoredCardsPageStyles.navContainer}>
                    <div className={StoredCardsPageStyles.navContainer}>
                        <NavBackArrowButton onBackClick={navigateToHome}/>
                    </div>
                    <div className={StoredCardsPageStyles.titleContainer}>
                        <PageTitle value={t('title')} testId={"stored-credentials"}/>
                        {/*TODO: use TertiaryButton here*/}
                        <button
                            data-testid={'btn-home'}
                            className={StoredCardsPageStyles.homeButton}
                            onClick={navigateToHome}
                        >
                            {t('Common:home')}
                        </button>
                    </div>
                </div>
                <div className={StoredCardsPageStyles.buttonContainer}>
                    <SolidButton testId={"add-credential"} onClick={navigateToHome} title={t('header.addCredential')}/>
                </div>
            </div>

            <div className={StoredCardsPageStyles.contentContainer}>
                {showContent()}
            </div>
        </div>
    );
};