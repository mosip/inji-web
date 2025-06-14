import {StoredCardsPage} from '../../../pages/User/StoredCards/StoredCardsPage';
import {fireEvent, screen, waitFor, within} from '@testing-library/react';
import {
    mockApiObject,
    mockLocalStorage,
    mockNavigatorOnline,
    mockusei18n,
    mockUseTranslation,
    renderWithRouter
} from '../../../test-utils/mockUtils';
import {KEYS} from "../../../utils/constants";

mockUseTranslation()
mockApiObject()

describe('Testing of StoredCardsPage ->', () => {
    let localStorageMock: {
        getItem: jest.Mock<string | null, [key: string]>;
        setItem: jest.Mock<void, [key: string, value: string]>
    };
    beforeEach(() => {
        jest.clearAllMocks();
        mockusei18n();
        // Reset fetch mock
        global.fetch = jest.fn();
        localStorageMock = mockLocalStorage();

        localStorageMock.setItem('selectedLanguage', 'en');
        localStorageMock.setItem(KEYS.WALLET_ID, "faa0e18f-0935-4fab-8ab3-0c546c0ca714")
    });


    const mockCredentials = [
        {
            credentialId: 'cred-1',
            credentialTypeDisplayName: 'Drivers License',
            issuerDisplayName: 'DMV',
            credentialTypeLogo: 'logo1.png',
        },
        {
            credentialId: 'cred-2',
            credentialTypeDisplayName: 'Health Card',
            issuerDisplayName: 'Ministry of Health',
            credentialTypeLogo: 'logo2.png',
        },
    ];

    describe("Layout of StoredCardsPage", () => {
        it('check if the loading layout is matching with snapshot', () => {
            const {asFragment} = renderWithRouter(<StoredCardsPage/>);

            expect(asFragment()).toMatchSnapshot();
        });

        it('check if the "No credentials found" layout is matching with snapshot', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => [],
            });

            const {asFragment} = renderWithRouter(<StoredCardsPage/>);
            await waitForLoaderDisappearance()

            expect(asFragment()).toMatchSnapshot();
        });

        it('should check if listing of credentials is matching snapshot', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockCredentials,
            });

            const {asFragment} = renderWithRouter(<StoredCardsPage/>);
            await waitForLoaderDisappearance();

            expect(asFragment()).toMatchSnapshot();
        });

        it('should check if error while fetching credentials is matching snapshot', async () => {
            (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

            const {asFragment} = renderWithRouter(<StoredCardsPage/>);
            await waitForLoaderDisappearance()

            expect(asFragment()).toMatchSnapshot();
        });
    })

    it('should navigate to home on nav back button click', () => {
        renderWithRouter(<StoredCardsPage/>);

        fireEvent.click(screen.getByTestId('back-arrow-icon'));

        expect(window.location.pathname).toBe('/user/home');
    });

    it('should navigate to home on Home text click', () => {
        renderWithRouter(<StoredCardsPage/>);

        fireEvent.click(screen.getByTestId('btn-home'));

        expect(window.location.pathname).toBe('/user/home');
    });

    it('should navigate to dashboard home when Add credential button is clicked in larger screens', () => {
        renderWithRouter(<StoredCardsPage/>);
        // In case of larger screens, the add cards button is inside the page title container
        const container = screen.getByTestId('page-title-container');
        const addCredentialButton = within(container).getByRole('button', {name: "Add Cards"});
        fireEvent.click(addCredentialButton);

        expect(window.location.pathname).toBe('/user/home');
    });

    it('should navigate to dashboard home when Add credential button in blank document is clicked in smaller screens', async () => {
        (global.fetch as jest.Mock).mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: async () => mockCredentials
            }), 100))
        );

        renderWithRouter(<StoredCardsPage/>);
        await waitForLoaderDisappearance();
        // In case of smaller screens , the add cards button is inside the content and action container
        const container = screen.getByTestId('content-and-action-container');
        const addCardsButton = within(container).getByRole('button', {name: "Add Cards"});
        fireEvent.click(addCardsButton);

        expect(window.location.pathname).toBe('/user/home');
    });

    it('should show loading state initially', async () => {
        (global.fetch as jest.Mock).mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: async () => mockCredentials
            }), 100))
        );

        renderWithRouter(<StoredCardsPage/>);

        expect(screen.getByTestId('loader-credentials')).toBeInTheDocument();
    });

    it('should display credentials when fetch is successful', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => {
                console.log("hi")
                return mockCredentials;
            },
        });

        renderWithRouter(<StoredCardsPage/>);

        await waitForLoaderDisappearance();

        expect(screen.getByText('Drivers License')).toBeInTheDocument();
        expect(screen.getByText('Health Card')).toBeInTheDocument();
    });

    it('should display "No Cards Stored!" when no credentials are returned', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        renderWithRouter(<StoredCardsPage/>);
        await waitForLoaderDisappearance()

        expect(screen.getByText('No Cards Stored!')).toBeInTheDocument();
        expect(screen.getByText("You haven't downloaded any cards yet. Tap \"Add Cards\" to get started.")).toBeInTheDocument();
    });

    const errorScenarios = [
        {
            name: 'internal server error',
            fetchResponse: {
                ok: false,
                status: 500,
                json: async () => ({errorMessage: 'Internal Server Error', errorCode: "internal_server_error"}),
            },
            expectedTitle: 'Server Error',
            expectedMessage: 'Something went wrong on our end. Please try again later.',
        },
        {
            name: 'service unavailable',
            fetchResponse: {
                ok: false,
                status: 503,
                json: async () => ({
                    errorMessage: 'service_unavailable',
                    errorCode: "Unavailable to connect to service"
                }),
            },
            expectedTitle: 'Service Unavailable',
            expectedMessage: 'We\'re currently experiencing some issues processing your request. Please try again later',
        },
        {
            name: 'invalid wallet request - Wallet key not found in session',
            fetchResponse: {
                ok: false,
                status: 400,
                json: async () => ({errorMessage: 'Wallet key not found in session', errorCode: "invalid_request"}),
            },
            expectedTitle: "Something Went Wrong",
            expectedMessage: "We couldn’t verify your wallet information. Please try again later."
        },
        {
            name: 'invalid wallet request - Wallet is locked',
            fetchResponse: {
                ok: false,
                status: 400,
                json: async () => ({errorMessage: 'Wallet is locked', errorCode: "invalid_request"}),
            },
            expectedTitle: "Something Went Wrong",
            expectedMessage: "We couldn’t verify your wallet information. Please try again later."
        }, {
            name: 'invalid wallet request - Invalid Wallet ID',
            fetchResponse: {
                ok: false,
                status: 400,
                json: async () => ({
                    errorMessage: "Invalid Wallet ID. Session and request Wallet ID do not match",
                    errorCode: "invalid_request"
                }),
            },
            expectedTitle: "Something Went Wrong",
            expectedMessage: "We couldn’t verify your wallet information. Please try again later."
        },
        {
            name: 'invalid request',
            fetchResponse: {
                ok: false,
                status: 400,
                json: async () => ({errorMessage: 'Some other error', errorCode: "invalid_request"}),
            },
            expectedTitle: "Request Error",
            expectedMessage: "Your request contains invalid information. Please try again later."
        },
        {
            name: 'unknown error',
            fetchResponse: {
                ok: false,
                status: 418,
                json: async () => ({errorMessage: 'I am a teapot'}),
            },
            expectedTitle: "Something Went Wrong",
            expectedMessage: "An unexpected error occurred. Please refresh the page or try again shortly."
        },
    ];
    it.each(errorScenarios)('should display error message for $name', async ({
                                                                                 fetchResponse,
                                                                                 expectedTitle,
                                                                                 expectedMessage
                                                                             }) => {
        (global.fetch as jest.Mock).mockResolvedValueOnce(fetchResponse);

        renderWithRouter(<StoredCardsPage/>);
        await waitForLoaderDisappearance();

        expect(screen.getByText(expectedTitle)).toBeInTheDocument();
        expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    });

    it('should redirect to root page when response is unAuthorized', () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({errorMessage: 'Unauthorized'}),
        });

        renderWithRouter(<StoredCardsPage/>);

        expect(window.location.pathname).toBe('/');
    });

    it('should display network error message when network error occurs', async () => {
        const onlineMock = mockNavigatorOnline(false);
        (global.fetch as jest.Mock).mockRejectedValueOnce(
            new TypeError('Failed to fetch')
        );

        renderWithRouter(<StoredCardsPage/>);
        await waitForLoaderDisappearance();

        expect(screen.getByText("No Internet Connection")).toBeInTheDocument();
        expect(screen.getByText('Please check your internet connection and try again.')).toBeInTheDocument();

        // reset to original online status
        onlineMock.reset();
    });

    it('should display generic error message when any unknown occurs', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        renderWithRouter(<StoredCardsPage/>);
        await waitForLoaderDisappearance()

        expect(screen.getByText("Something Went Wrong")).toBeInTheDocument();
        expect(screen.getByText('An unexpected error occurred. Please refresh the page or try again shortly.')).toBeInTheDocument();
    });

    it('should filter credentials when using search bar', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockCredentials,
        });

        renderWithRouter(<StoredCardsPage/>);
        await waitForLoaderDisappearance()

        const searchInput = screen.getByPlaceholderText('Search your cards by Name');
        fireEvent.change(searchInput, {target: {value: 'Health'}});

        expect(screen.getByText('Health Card')).toBeInTheDocument();
        expect(screen.queryByText('Drivers License')).not.toBeInTheDocument();
    });

    it('should display "No cards match your search" when search has no matches', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockCredentials,
        });

        renderWithRouter(<StoredCardsPage/>);
        await waitForLoaderDisappearance()

        const searchInput = screen.getByPlaceholderText('Search your cards by Name');
        fireEvent.change(searchInput, {target: {value: 'Passport'}});

        expect(screen.getByText('No cards match your search.')).toBeInTheDocument();
    });

    it('should reset filtered credentials when search is cleared', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockCredentials,
        });

        renderWithRouter(<StoredCardsPage/>);

        await waitForLoaderDisappearance()
        const searchInput = screen.getByPlaceholderText('Search your cards by Name');

        // Filter to just Health Card
        fireEvent.change(searchInput, {target: {value: 'Health'}});
        expect(screen.getByText('Health Card')).toBeInTheDocument();
        expect(screen.queryByText('Drivers License')).not.toBeInTheDocument();

        // Clear the filter
        fireEvent.change(searchInput, {target: {value: ''}});

        // Should show all credentials again
        expect(screen.getByText('Health Card')).toBeInTheDocument();
        expect(screen.getByText('Drivers License')).toBeInTheDocument();
    });

    it('should call download api when clicked on download icon in card', async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce(
                {
                    ok: true,
                    json: async () => mockCredentials,
                }
            )
            .mockResolvedValueOnce({
                ok: true,
                blob: async () => new Blob(),
                headers: {
                    get: () => 'attachment; filename="credential.pdf"',
                },
            });

        renderWithRouter(<StoredCardsPage/>);
        await waitForLoaderDisappearance()

        const downloadButton = screen.getAllByTestId('icon-download')[0];
        fireEvent.click(downloadButton);

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("wallets/faa0e18f-0935-4fab-8ab3-0c546c0ca714/credentials/cred-1?action=download"),
            expect.objectContaining({
                "credentials": "include",
                "headers": {"Accept": "application/pdf", "Accept-Language": "en", "Content-Type": "application/json"},
                "method": "GET"
            })
        );
    });

    it('should delete credential and call fetch all credentials api again when user deletes a card', async () => {
        const mockDeleteResponse = {
            ok: true,
            json: async () => ({message: 'Credential deleted successfully'}),
        };

        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockCredentials,
            })
            .mockResolvedValueOnce(mockDeleteResponse)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [mockCredentials[1]],
            });

        renderWithRouter(<StoredCardsPage/>);
        await waitForLoaderDisappearance();

        let menu = screen.getAllByTestId("icon-three-dots-menu")[0];
        fireEvent.click(menu);
        expect(screen.getByRole("menu")).toBeInTheDocument()
        const deleteButton = screen.getByTestId('icon-delete');
        fireEvent.click(deleteButton);
        fireEvent.click(screen.getByRole('button', {name: "Confirm"}));
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("wallets/faa0e18f-0935-4fab-8ab3-0c546c0ca714/credentials/cred-1"),
            expect.objectContaining({
                "credentials": "include",
                "headers": {"Content-Type": "application/json"},
                "method": "DELETE"
            })
        );

        // Check if fetch for all credentials is called again
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("wallets/faa0e18f-0935-4fab-8ab3-0c546c0ca714/credentials"),
            expect.objectContaining({
                "credentials": "include",
                "headers": {"Accept-Language": "en", "Content-Type": "application/json"},
                "method": "GET"
            })
        );
        await waitFor(() =>
            expect(screen.queryByText('Drivers License')).not.toBeInTheDocument()
        )
        expect(screen.getByText('Health Card')).toBeInTheDocument();
    });

    async function waitForLoaderDisappearance() {
        await waitFor(() => {
            expect(screen.queryByTestId('loader-credentials')).not.toBeInTheDocument();
        });
    }
});