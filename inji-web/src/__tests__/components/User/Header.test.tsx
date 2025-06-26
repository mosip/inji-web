import {setMockUseSelectorState} from '../../../test-utils/mockReactRedux';
import {mockNavigateFn, setMockUseLocation} from '../../../test-utils/mockRouter';
import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import {Header} from '../../../components/User/Header';
import {useUser} from '../../../hooks/User/useUser';
import * as i18n from '../../../utils/i18n';
import {mockApiResponse, mockUseApi} from "../../../test-utils/setupUseApiMock";

jest.mock('../../../hooks/User/useUser', () => ({
    useUser: jest.fn(),
}));

jest.mock('../../../hooks/useApi.ts', () => ({
    useApi: () => mockUseApi
}))

jest.mock('../../../utils/i18n', () => ({
    isRTL: jest.fn(),
    LanguagesSupported: [
        {label: "English", value: 'en'},
        {label: "தமிழ்", value: 'ta'},
        {label: "ಕನ್ನಡ", value: 'kn'},
        {label: "हिंदी", value: 'hi'},
        {label: "Français", value: 'fr'},
        {label: "عربي", value: 'ar'},
        {label: "Português", value: 'pt'}
    ]
}));

jest.mock('../../../assets/HamburgerMenu.svg', () => 'mock-hamburger-icon');
jest.mock('../../../assets/InjiWebLogo.png', () => 'mock-injiweb-logo');

(globalThis as any).crypto = {
    getRandomValues: (arr: any) => arr.map(() => Math.floor(Math.random() * 256))
};

describe('Header', () => {
    const mockRemoveUser = jest.fn();
    const mockHeaderRef = {current: null};

    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigateFn.mockReset();
        setMockUseLocation({pathname: '/'});

        (useUser as jest.Mock).mockReturnValue({
            user: {displayName: 'John Doe', profilePictureUrl: ''},
            removeUser: mockRemoveUser,
            isLoading: false,
        });
        setMockUseSelectorState({common: {language: "en"}});
        (i18n.isRTL as unknown as jest.Mock).mockReturnValue(false);

    });

    it('renders header and user details correctly', () => {
        render(
            <Header headerRef={mockHeaderRef} headerHeight={50}/>
        );

        expect(screen.getByTestId('dashboard-header-container')).toBeInTheDocument();
        expect(screen.getByTestId('hamburger-menu')).toBeInTheDocument();
        expect(screen.getByTestId('header-injiWeb-logo')).toBeInTheDocument();
        expect(screen.getByTestId('profile-details')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument(); // From PascalCase util
    });

    it('toggles profile dropdown on click', () => {
        render(
            <Header headerRef={mockHeaderRef} headerHeight={50}/>
        );

        const profileArrow = screen.getByTestId('profile-details').querySelector('svg');
        expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();

        fireEvent.click(profileArrow!);
        expect(screen.getByTestId('profile-dropdown')).toBeInTheDocument();

        fireEvent.click(profileArrow!);
        expect(screen.queryByTestId('profile-dropdown')).not.toBeInTheDocument();
    });

    it('toggles hamburger menu dropdown', () => {
        render(
            <Header headerRef={mockHeaderRef} headerHeight={50}/>
        );

        const hamburgerIcon = screen.getByTestId('icon-hamburger-menu');
        expect(screen.getByTestId('hamburger-menu-dropdown')).toBeInTheDocument();
        fireEvent.click(hamburgerIcon);
        expect(screen.getByTestId('hamburger-menu-dropdown')).toBeInTheDocument();
    });

    it('navigates to profile on dropdown item click', async () => {
        render(<Header headerRef={mockHeaderRef} headerHeight={50}/>);

        const profileDetails = screen.getByTestId('profile-details');
        const arrowIconSvg = profileDetails.querySelector('svg');
        fireEvent.click(arrowIconSvg!);

        const profileOption = await screen.findByText('ProfileDropdown.profile');
        fireEvent.click(profileOption);

        expect(mockNavigateFn).toHaveBeenCalledWith('/user/profile', {
            state: {from: '/'},
        });
    });

    it('logs out and redirects on logout click', async () => {
        mockApiResponse({
            response: {}
        })
        render(
            <Header headerRef={mockHeaderRef} headerHeight={50}/>
        );

        fireEvent.click(screen.getByTestId('profile-details').querySelector('svg')!);
        fireEvent.click(screen.getByText('ProfileDropdown.logout'));

        await waitFor(() => {
            expect(mockUseApi.fetchData).toHaveBeenCalled();
        });
        expect(mockRemoveUser).toHaveBeenCalled();

        mockUseApi.fetchData.mockRestore();
    });
});
