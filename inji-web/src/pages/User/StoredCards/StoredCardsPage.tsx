import React, {Fragment, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {NavBackArrowButton} from '../../../components/Common/Buttons/NavBackArrowButton';
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
import {TertiaryButton} from "../../../components/Common/Buttons/TertiaryButton";
import {navigateToUserHome} from "../../../utils/navigationUtils";
import {downloadCredentialPDF} from "../../../utils/misc";

export const StoredCardsPage: React.FC = () => {
    const {t} = useTranslation('StoredCards');
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState<WalletCredential[]>([]);
    const [filteredCredentials, setFilteredCredentials] = useState<WalletCredential[]>([]);
    const [loading, setLoading] = useState(true);
    const language = useSelector((state: RootState) => state.common.language);
    const [error, setError] = useState<string>();

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
                console.error("Error fetching credentials:", responseData);
                if (response.status === 500) {
                    setError("internalServerError");
                } else if (response.status === 503) {
                    setError("serviceUnavailable");
                } else if (response.status === 400) {
                    const invalidWalletRequests = ["Wallet key not found in session", "Wallet is locked", "Invalid Wallet ID. Session and request Wallet ID do not match"]
                    if (invalidWalletRequests.includes(responseData.errorMessage)) {
                        setError("invalidWalletRequest");
                    } else {
                        setError("invalidRequest");
                    }
                } else {
                    setError("unknownError");
                }
            }
        } catch (error) {
            console.error("Failed to fetch credentials:", error);
            setError("networkError");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletCredentials().then(_ => console.debug("Credentials fetched successfully"));
    }, []);

    const preview = async (_: WalletCredential) => console.log("Preview");
    const download = async (credential: WalletCredential) => {
        try {
            const response = await fetch(
                api.fetchWalletCredentialPreview.url(credential.credentialId),
                {
                    method:
                        api.fetchWalletCredentialPreview.methodType === 0
                            ? "GET"
                            : "POST",
                    headers: api.fetchWalletCredentialPreview.headers(language),
                    credentials: api.fetchWalletCredentialPreview.credentials
                }
            );
            //
            const pdfContent = await response.blob();

            const disposition = response.headers.get("Content-Disposition");
            const fileNameMatch = /filename="(.+)"/.exec(disposition ?? "");
            const fileName = fileNameMatch?.[1] || "download.pdf";

            await downloadCredentialPDF(pdfContent, fileName);
        } catch (error) {
            console.error("Failed to download credential PDF:", error);
            // setError("downloadError");
        }
    }

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

    const navigateToHome = () => navigateToUserHome(navigate);

    const loader =
        <div className={StoredCardsPageStyles.loaderContainer} data-testid={"loader-credentials"}>
            <SpinningLoader/>
        </div>

    function displayCredentials() {
        // In case of no credentials, show empty screen with action to add cards in mobile view
        if (credentials.length === 0) {
            return <InfoSection title={t('emptyScreen.title')}
                                message={t('emptyScreen.actionText')}
                                icon={<DocumentIcon/>}
                                testId={"no-credentials-downloaded"}
                                mobileAction={addCard()}
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
                                onPreview={preview}
                                onDownload={download}
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

        if (error) {
            return (
                <Error
                    message={t(`error.${error}.title`)}
                    helpText={t(`error.${error}.message`)}
                    testId={"stored-credentials"}
                    action={<BorderedButton testId={"btn-go-home"} onClick={navigateToHome}
                                            title={t('Common:goToHome')}/>}
                />
            );
        }

        return displayCredentials();
    };

    const addCard = () => <SolidButton testId={"btn-add-cards"} onClick={navigateToHome}
                                       title={t('header.addCards')}/>;

    return (
        <div className={StoredCardsPageStyles.container}>
            <div className={StoredCardsPageStyles.headerContainer} data-testid={"page-title-container"}>
                <div className={StoredCardsPageStyles.navContainer}>
                    <div className={StoredCardsPageStyles.navContainer}>
                        <NavBackArrowButton onBackClick={navigateToHome}/>
                    </div>
                    <div className={StoredCardsPageStyles.titleContainer}>
                        <PageTitle value={t('title')} testId={"stored-credentials"}/>
                        <TertiaryButton onClick={navigateToHome} title={t('Common:home')} testId={"home"}/>
                    </div>
                </div>
                <div className={`${StoredCardsPageStyles.buttonContainer.large}`}>
                    {addCard()}
                </div>
            </div>

            <div className={StoredCardsPageStyles.contentAndActionContainer}
                 data-testid={"content-and-action-container"}>
                <div className={StoredCardsPageStyles.contentContainer}>
                    {showContent()}
                </div>
                {/*show add cards button at bottom in mobile only while filtering did not yield result*/}
                {!loading && credentials.length !== 0 &&
                    <div className={StoredCardsPageStyles.buttonContainer.mobile}>
                        {addCard()}
                    </div>
                }
            </div>
        </div>
    );
};