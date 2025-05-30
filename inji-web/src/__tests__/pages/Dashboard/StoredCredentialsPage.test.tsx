import {StoredCredentialsPage} from '../../../pages/Dashboard/StoredCredentialsPage';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {mockusei18n, renderWithRouter} from '../../../test-utils/mockUtils';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key
    }),
    initReactI18next: {
        type: '3rdParty',
        init: jest.fn()
    }
}));

describe('Testing the Layout of StoredDocumentsPage ->', () => {
    let renderedComponent: ReturnType<typeof render>;

    beforeEach(() => {
        jest.clearAllMocks();
        mockusei18n();
        renderedComponent = renderWithRouter(<StoredCredentialsPage />);
    });

    //TODO: Snapshot tests will be unskipped at last once UI is fully ready
    it.skip('check if the layout is matching with snapshot', () => {
        const {asFragment} = renderedComponent;

        expect(asFragment()).toMatchSnapshot();
    });

    //TODO: Do we need this considering snapshot testing?
    it.skip('check if it renders text elements correctly using translation keys', () => {
        expect(screen.getByTestId('Stored-Credentials')).toBeInTheDocument();
        expect(screen.getByTestId('Home')).toBeInTheDocument();
        expect(screen.getByTestId('Back-Arrow-Icon')).toBeInTheDocument();
        expect(screen.getByTestId('Add-Credential')).toBeInTheDocument();
        expect(screen.getByTestId('Blank-Document')).toBeInTheDocument();
        expect(screen.getByTestId('Document-Icon')).toBeInTheDocument();
        expect(screen.getByTestId('No-Credentials-Title')).toBeInTheDocument();
    });

    it('should navigate to dashboard home on nav back button click', () => {
        fireEvent.click(screen.getByTestId('Back-Arrow-Icon'));

        expect(window.location.pathname).toBe('/dashboard/home');
    });

    it('should navigate to dashboard home on Home text click', () => {
        fireEvent.click(screen.getByTestId('Home'));

        expect(window.location.pathname).toBe('/dashboard/home');
    });

    it('should navigate to dashboard home when Add credential button is clicked in larger screens', () => {
        setScreenWidth(764);

        const addCredentialButton = screen.getByRole('button', {name: "Add credential"});
        fireEvent.click(addCredentialButton);

        expect(window.location.pathname).toBe('/dashboard/home');
    });

    it('should navigate to dashboard home when Add credential button in blank document is clicked in smaller screens', () => {
        setScreenWidth(400);

        const addCredentialButton = screen.getByRole('button', {name: "Add credential"});
        fireEvent.click(addCredentialButton);

        expect(window.location.pathname).toBe('/dashboard/home');
    });

    // // Mock dependencies
    // jest.mock('../../../utils/api', () => ({
    //   api: {
    //     fetchWalletVCs: {
    //       url: jest.fn().mockReturnValue('/api/wallet/credentials'),
    //       headers: jest.fn().mockReturnValue({
    //         'Content-Type': 'application/json',
    //         'Accept-Language': 'en'
    //       }),
    //     },
    //   },
    // }));


    // Mock data
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

    describe('Testing StoredCredentialsPage API interactions and states ->', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        mockusei18n();

        // Reset fetch mock
        global.fetch = jest.fn();
      });

      it('should show loading state initially', async () => {
        (global.fetch as jest.Mock).mockImplementation(() =>
          new Promise(resolve => setTimeout(() => resolve({
            ok: true,
            json: async () => mockCredentials
          }), 100))
        );

        render(<StoredCredentialsPage />);

        expect(screen.getByTestId('spinning-loader')).toBeInTheDocument();
      });

      it('should display credentials when fetch is successful', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockCredentials,
        });

        render(<StoredCredentialsPage />);

        await waitFor(() => {
          expect(screen.queryByTestId('spinning-loader')).not.toBeInTheDocument();
        });

        expect(screen.getByText('Drivers License')).toBeInTheDocument();
        expect(screen.getByText('Health Card')).toBeInTheDocument();
      });

      it('should display "No Cards Stored!" when no credentials are returned', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

        render(<StoredCredentialsPage />);

        await waitFor(() => {
          expect(screen.queryByTestId('spinning-loader')).not.toBeInTheDocument();
        });

        expect(screen.getByText('No Cards Stored!')).toBeInTheDocument();
        expect(screen.getByText(/You haven't downloaded any credentials yet/)).toBeInTheDocument();
      });

      it('should display error message when fetch fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          json: async () => ({ errorMessage: 'Failed to fetch credentials' }),
        });

        render(<StoredCredentialsPage />);

        await waitFor(() => {
          expect(screen.queryByTestId('spinning-loader')).not.toBeInTheDocument();
        });

        expect(screen.getByText('errorTitle')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch credentials')).toBeInTheDocument();
      });

      it('should display network error message when fetch throws', async () => {
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        render(<StoredCredentialsPage />);

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

        render(<StoredCredentialsPage />);

        await waitFor(() => {
          expect(screen.queryByTestId('spinning-loader')).not.toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search your documents by Name');
        fireEvent.change(searchInput, { target: { value: 'Health' } });

        expect(screen.getByText('Health Card')).toBeInTheDocument();
        expect(screen.queryByText('Drivers License')).not.toBeInTheDocument();
      });

      it('should display "No cards match your search" when search has no matches', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockCredentials,
        });

        render(<StoredCredentialsPage />);

        await waitFor(() => {
          expect(screen.queryByTestId('spinning-loader')).not.toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search your documents by Name');
        fireEvent.change(searchInput, { target: { value: 'Passport' } });

        expect(screen.getByText('No cards match your search.')).toBeInTheDocument();
      });

      it('should reset filtered credentials when search is cleared', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockCredentials,
        });

        render(<StoredCredentialsPage />);

        await waitFor(() => {
          expect(screen.queryByTestId('spinning-loader')).not.toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search your documents by Name');

        // Filter to just Health Card
        fireEvent.change(searchInput, { target: { value: 'Health' } });
        expect(screen.getByText('Health Card')).toBeInTheDocument();
        expect(screen.queryByText('Drivers License')).not.toBeInTheDocument();

        // Clear the filter
        fireEvent.change(searchInput, { target: { value: '' } });

        // Should show all credentials again
        expect(screen.getByText('Health Card')).toBeInTheDocument();
        expect(screen.getByText('Drivers License')).toBeInTheDocument();
      });
    });
});

const setScreenWidth = (width: number) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
};
