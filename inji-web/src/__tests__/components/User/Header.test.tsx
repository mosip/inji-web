import { setMockUseSelectorState} from '../../../test-utils/mockReactRedux';
import { setMockUseLocation,mockNavigateFn } from '../../../test-utils/mockRouter';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Header } from '../../../components/User/Header';
import { useCookies } from 'react-cookie';
import { useUser } from '../../../hooks/User/useUser';
import * as i18n from '../../../utils/i18n';
jest.mock('react-cookie', () => ({
  useCookies: jest.fn(),
}));

jest.mock('../../../hooks/User/useUser', () => ({
  useUser: jest.fn(),
}));

jest.mock('../../../utils/i18n', () => ({
    isRTL: jest.fn(),
    LanguagesSupported: [
      { label: "English", value: 'en' },
      { label: "தமிழ்", value: 'ta' },
      { label: "ಕನ್ನಡ", value: 'kn' },
      { label: "हिंदी", value: 'hi' },
      { label: "Français", value: 'fr' },
      { label: "عربي", value: 'ar' },
      { label: "Português", value: 'pt' }
    ]
}));

jest.mock('../../../assets/HamburgerMenu.svg', () => 'mock-hamburger-icon');
jest.mock('../../../assets/InjiWebLogo.png', () => 'mock-injiweb-logo');

(globalThis as any).crypto = {
    getRandomValues: (arr: any) => arr.map(() => Math.floor(Math.random() * 256))
  };

describe('Header', () => {
  const mockRemoveUser = jest.fn();
  const mockHeaderRef = { current: null };

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigateFn.mockReset();
    setMockUseLocation({ pathname: '/' });

    (useCookies as jest.Mock).mockReturnValue([{ 'XSRF-TOKEN': 'token' }]);
    (useUser as jest.Mock).mockReturnValue({
      user: { displayName: 'John Doe', profilePictureUrl: '' },
      removeUser: mockRemoveUser,
      isLoading: false,
    });
    setMockUseSelectorState({common:{language:"en"}});
    (i18n.isRTL as unknown as jest.Mock).mockReturnValue(false);

  });

  it('renders header and user details correctly', () => {
    const { getByTestId, getByText } = render(
      <Header headerRef={mockHeaderRef} headerHeight={50} />
    );

    expect(getByTestId('dashboard-header-container')).toBeInTheDocument();
    expect(getByTestId('hamburger-menu')).toBeInTheDocument();
    expect(getByTestId('header-injiWeb-logo')).toBeInTheDocument();
    expect(getByTestId('profile-details')).toBeInTheDocument();
    expect(getByText('John Doe')).toBeInTheDocument(); // From PascalCase util
  });

  it('toggles profile dropdown on click', () => {
    const { getByTestId, queryByTestId } = render(
      <Header headerRef={mockHeaderRef} headerHeight={50} />
    );

    const profileArrow = getByTestId('profile-details').querySelector('svg');
    expect(queryByTestId('profile-dropdown')).not.toBeInTheDocument();

    fireEvent.click(profileArrow!);
    expect(queryByTestId('profile-dropdown')).toBeInTheDocument();

    fireEvent.click(profileArrow!);
    expect(queryByTestId('profile-dropdown')).not.toBeInTheDocument();
  });

  it('toggles hamburger menu dropdown', () => {
    const { getByTestId, queryByTestId } = render(
      <Header headerRef={mockHeaderRef} headerHeight={50} />
    );

    const hamburgerIcon = getByTestId('icon-hamburger-menu');
    expect(queryByTestId('hamburger-menu-dropdown')).toBeInTheDocument();
    fireEvent.click(hamburgerIcon);
    expect(queryByTestId('hamburger-menu-dropdown')).toBeInTheDocument();
  });

  it('navigates to profile on dropdown item click', async () => {
    render(<Header headerRef={mockHeaderRef} headerHeight={50} />);

    const profileDetails = screen.getByTestId('profile-details');
    const arrowIconSvg = profileDetails.querySelector('svg');
    fireEvent.click(arrowIconSvg!);

    const profileOption = await screen.findByText('ProfileDropdown.profile');
    fireEvent.click(profileOption);

    expect(mockNavigateFn).toHaveBeenCalledWith('/user/profile', {
      state: { from: '/' },
    });
  });

  it('logs out and redirects on logout click', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    const { getByTestId, getByText } = render(
      <Header headerRef={mockHeaderRef} headerHeight={50} />
    );

    fireEvent.click(getByTestId('profile-details').querySelector('svg')!);
    fireEvent.click(getByText('ProfileDropdown.logout'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(mockRemoveUser).toHaveBeenCalled();
    });

    mockFetch.mockRestore();
  });
});
