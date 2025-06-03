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
        expect(screen.getByTestId('stored-credentials')).toBeInTheDocument();
        expect(screen.getByTestId('btn-home')).toBeInTheDocument();
        expect(screen.getByTestId('back-arrow-icon')).toBeInTheDocument();
        expect(screen.getByTestId('add-credential')).toBeInTheDocument();
        expect(screen.getByTestId('blank-document')).toBeInTheDocument();
        expect(screen.getByTestId('document-icon')).toBeInTheDocument();
        expect(screen.getByTestId('no-credentials-title')).toBeInTheDocument();
    });

    it('should navigate to dashboard home on nav back button click', () => {
        fireEvent.click(screen.getByTestId('back-arrow-icon'));

        expect(window.location.pathname).toBe('/dashboard/home');
    });

    it('should navigate to dashboard home on Home text click', () => {
        fireEvent.click(screen.getByTestId('btn-home'));

        expect(window.location.pathname).toBe('/dashboard/home');
    });

    it('should navigate to dashboard home when Add credential button is clicked in larger screens', () => {
        setScreenWidth(764);

        fireEvent.click(screen.getByTestId('add-credential'));

        expect(window.location.pathname).toBe('/dashboard/home');
    });

    it('should navigate to dashboard home when Add credential button in blank document is clicked in smaller screens', () => {
        setScreenWidth(400);

        fireEvent.click(screen.getByTestId('add-credential'));

        expect(window.location.pathname).toBe('/dashboard/home');
    });
});

const setScreenWidth = (width: number) => {
    window.innerWidth = width;
    window.dispatchEvent(new Event('resize'));
};
