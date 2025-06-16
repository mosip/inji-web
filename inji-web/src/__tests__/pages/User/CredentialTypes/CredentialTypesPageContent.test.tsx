import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import {
    CredentialTypesPageContent
} from "../../../../components/User/CredentialTypes/CredentialTypesPageContent.tsx";
import {RequestStatus} from "../../../../hooks/useFetch";

const mockDownloadResult = jest.fn();
const mockCredentialListWrapper = jest.fn();

jest.mock('../../../../components/Redirection/DownloadResult', () => ({
    DownloadResult: (props: any) => {
        mockDownloadResult(props);
        return <div data-testid="mock-download-result" />;
    },
}));

jest.mock('../../../../components/Credentials/CredentialListWrapper', () => ({
    CredentialListWrapper: (props: any) => {
        mockCredentialListWrapper(props);
        return <div data-testid="mock-credential-list-wrapper" />;
    },
}));

const dummyTranslations = {
    en: {
        'CredentialTypesPage:download.loading.header': 'Downloading Credential',
        'CredentialTypesPage:download.error.header': 'Download Failed',
        'CredentialTypesPage:download.error.subHeader': 'Unable to download the card. Please click on "Go to Home" button to start the process.',
    },
    fr: {
        'CredentialTypesPage:download.loading.header': 'Téléchargement des informations d\'identification',
        'CredentialTypesPage:download.error.header': 'Échec du téléchargement',
        'CredentialTypesPage:download.error.subHeader': 'Impossible de télécharger la carte. Veuillez cliquer sur le bouton « Accueil » pour lancer le processus.',
    },
};

jest.mock('react-i18next', () => {
    if (!(globalThis as any).__mockI18nLanguage__) {
        (globalThis as any).__mockI18nLanguage__ = 'en';
    }

    return {
        useTranslation: () => ({
            t: (key: string) => {
                const lang = (globalThis as any).__mockI18nLanguage__;
                const translations = (dummyTranslations as any)[lang];
                let result = translations[key] || key;

                return result;
            },
            i18n: {
                language: (globalThis as any).__mockI18nLanguage__,
                changeLanguage: (lng: string) => {
                    (globalThis as any).__mockI18nLanguage__ = lng;
                    return Promise.resolve();
                },
            },
        }),
    };
});

describe('Testing of RenderModalBasedOnDownloadStatus -> ', () => {
    const renderComponent = async (
        downloadStatus: RequestStatus | null,
        language: string = 'en',
        state: RequestStatus,
    ) => {
        (globalThis as any).__mockI18nLanguage__ = language;
        render(<CredentialTypesPageContent downloadStatus={downloadStatus} state={state} />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (globalThis as any).__mockI18nLanguage__ = 'en';
    });

    test.each([
        {
            testName: 'renders loading modal when downloadStatus is LOADING',
            downloadStatus: RequestStatus.LOADING,
            language: 'en',
            expectedProps: {
                title: dummyTranslations.en['CredentialTypesPage:download.loading.header'],
                state: RequestStatus.LOADING,
            },
        },
        {
            testName: 'renders error modal when downloadStatus is ERROR',
            downloadStatus: RequestStatus.ERROR,
            language: 'en',
            expectedProps: {
                title: dummyTranslations.en['CredentialTypesPage:download.error.header'],
                subTitle: dummyTranslations.en['CredentialTypesPage:download.error.subHeader'],
                state: RequestStatus.ERROR,
            },
        },
        {
            testName: 'renders error modal with French translations',
            downloadStatus: RequestStatus.ERROR,
            language: 'fr',
            expectedProps: {
                title: dummyTranslations.fr['CredentialTypesPage:download.error.header'],
                subTitle: dummyTranslations.fr['CredentialTypesPage:download.error.subHeader'],
                state: RequestStatus.ERROR,
            },
        },
    ])(
        '$testName',
        async ({downloadStatus, language, expectedProps}) => {
            await renderComponent(downloadStatus, language, downloadStatus as RequestStatus);

            await waitFor(() => {
                expect(mockDownloadResult).toHaveBeenCalledWith(
                    expect.objectContaining(expectedProps)
                );
                expect(mockDownloadResult).toHaveBeenCalledTimes(1);
                expect(screen.getByTestId('mock-download-result')).toBeInTheDocument();
            });
        }
    );

    test('renders credential list when downloadStatus is null', async () => {
        await renderComponent(null, 'en', RequestStatus.DONE);

        expect(screen.getByTestId('mock-credential-list-wrapper')).toBeInTheDocument();
        expect(mockDownloadResult).not.toHaveBeenCalled();
        expect(screen.queryByTestId('mock-download-result')).not.toBeInTheDocument();
    });
});