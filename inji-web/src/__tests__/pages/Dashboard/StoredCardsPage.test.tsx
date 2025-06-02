import {StoredCardsPage} from '../../../pages/Dashboard/StoredCards/StoredCardsPage';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import {mockApiObject, mockusei18n, mockUseTranslation, renderWithRouter} from '../../../test-utils/mockUtils';

mockUseTranslation()
mockApiObject()

describe('Testing of StoredCardsPage ->', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockusei18n();

        // Reset fetch mock
        global.fetch = jest.fn();
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

    //TODO: Snapshot tests will be unskipped at last once UI is fully ready
    it.skip('check if the layout is matching with snapshot', () => {
        const {asFragment} = renderWithRouter(<StoredCardsPage/>);

        expect(asFragment()).toMatchSnapshot();
    });

    it('should navigate to home on nav back button click', () => {
        renderWithRouter(<StoredCardsPage/>);

        fireEvent.click(screen.getByTestId('Back-Arrow-Icon'));

        expect(window.location.pathname).toBe('/dashboard/home');
    });

    it('should navigate to home on Home text click', () => {
        renderWithRouter(<StoredCardsPage/>);

        fireEvent.click(screen.getByTestId('btn-home'));

        expect(window.location.pathname).toBe('/dashboard/home');
    });

    it('should navigate to dashboard home when Add credential button is clicked in larger screens', () => {
        setScreenWidth(764);

        renderWithRouter(<StoredCardsPage/>);
        const addCredentialButton = screen.getByRole('button', {name: "Add Cards"});
        fireEvent.click(addCredentialButton);

        expect(window.location.pathname).toBe('/dashboard/home');
    });

    it('should navigate to dashboard home when Add credential button in blank document is clicked in smaller screens', () => {
        setScreenWidth(400);

        renderWithRouter(<StoredCardsPage/>);
        const addCredentialButton = screen.getByRole('button', {name: "Add Cards"});
        fireEvent.click(addCredentialButton);

        expect(window.location.pathname).toBe('/dashboard/home');
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
        expect(screen.getByText("You haven't downloaded any credentials yet. Tap \"Add Card\" to get started.")).toBeInTheDocument();
    });

    it.skip('should display error message when fetch fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: async () => ({errorMessage: 'Failed to fetch credentials'}),
        });

        renderWithRouter(<StoredCardsPage/>);
        await waitForLoaderDisappearance()

        expect(screen.getByText('errorTitle')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch credentials')).toBeInTheDocument();
    });

    it.skip('should display network error message when fetch throws', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        renderWithRouter(<StoredCardsPage/>);

        await waitFor(() => {
            expect(screen.queryByTestId('spinning-loader')).not.toBeInTheDocument();
        });

        expect(screen.getByText('errorTitle')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch credentials. Please try again later.')).toBeInTheDocument();
    });

    it('should filter credentials when using search bar', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockCredentials,
        });

        renderWithRouter(<StoredCardsPage/>);
        await waitForLoaderDisappearance()

        const searchInput = screen.getByPlaceholderText('Search your documents by Name');
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

        const searchInput = screen.getByPlaceholderText('Search your documents by Name');
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
        const searchInput = screen.getByPlaceholderText('Search your documents by Name');

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

    async function waitForLoaderDisappearance() {
        await waitFor(() => {
            expect(screen.queryByTestId('loader-credentials')).not.toBeInTheDocument();
        });
    }
});

const setScreenWidth = (width: number) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
};
