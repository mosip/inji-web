import {render, screen} from '@testing-library/react';
import { useUser } from '../../../hooks/User/useUser';
import { HomePage } from '../../../pages/User/Home/HomePage';

// Mock dependencies
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            if (key === 'Home.welcome') return 'Welcome';
            return key;
        },
    }),
}));

jest.mock('../../../hooks/User/useUser', () => ({
    useUser: jest.fn(),
}));

jest.mock('../../../pages/IssuersPage', () => ({
    IssuersPage: () => <div data-testid="issuers-page">IssuersPage</div>,
}));

describe('HomePage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders welcome message with PascalCase name', () => {
        (useUser as jest.Mock).mockReturnValue({
            user: {displayName: 'John Doe'},
        });

        render(<HomePage />);

        expect(screen.getByText("Welcome John Doe!")).toBeInTheDocument();
    });

    it('renders IssuersPage component', () => {
        (useUser as jest.Mock).mockReturnValue({
            user: {displayName: 'Test User'},
        });

        render(<HomePage />);
        expect(screen.getByTestId('issuers-page')).toBeInTheDocument();
    });
    
    it('matches snapshot when user is undefined', () => {
        (useUser as jest.Mock).mockReturnValue({ user: undefined });
        const { asFragment } = render(<HomePage />);
        expect(asFragment()).toMatchSnapshot();
      });
    
      it('matches snapshot when user has a displayName', () => {
        (useUser as jest.Mock).mockReturnValue({ user: { displayName: 'Jane Smith' } });
        const { asFragment } = render(<HomePage />);
        expect(asFragment()).toMatchSnapshot();
      });
});
