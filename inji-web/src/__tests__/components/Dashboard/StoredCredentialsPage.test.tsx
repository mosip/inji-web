import {StoredCredentialsPage} from '../../../pages/Dashboard/StoredCredentialsPage';
import {render, screen, fireEvent} from '@testing-library/react';
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

    it('check if the layout is matching with snapshot', () => {
        const {asFragment} = renderedComponent;

        expect(asFragment()).toMatchSnapshot();
    });

    it('check if it renders text elements correctly using translation keys', () => {
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

        fireEvent.click(screen.getByTestId('Add-Credential'));

        expect(window.location.pathname).toBe('/dashboard/home');
    });

    it('should navigate to dashboard home when Add credential button in blank document is clicked in smaller screens', () => {
        setScreenWidth(400);

        fireEvent.click(screen.getByTestId('Add-Credential'));

        expect(window.location.pathname).toBe('/dashboard/home');
    });
});

const setScreenWidth = (width: number) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
};
