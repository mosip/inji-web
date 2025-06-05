import { render, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '../../../components/Dashboard/Header';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useUser } from '../../../hooks/useUser';
import { useSelector,useDispatch} from 'react-redux';
import * as i18n from '../../../utils/i18n';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-cookie', () => ({
  useCookies: jest.fn(),
}));

jest.mock('../../../hooks/useUser', () => ({
  useUser: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
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
  const mockNavigate = jest.fn();
  const mockRemoveUser = jest.fn();
  const mockHeaderRef = { current: null };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useCookies as jest.Mock).mockReturnValue([{ 'XSRF-TOKEN': 'token' }]);
    (useUser as jest.Mock).mockReturnValue({
      user: { displayName: 'John Doe', profilePictureUrl: '' },
      removeUser: mockRemoveUser,
      isLoading: false,
    });
    (useSelector as unknown as jest.Mock).mockReturnValue('en');
    (useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn());
    (i18n.isRTL as unknown as jest.Mock).mockReturnValue(false);

    jest.clearAllMocks();
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

    const hamburgerIcon = getByTestId('hamburger-menu-icon');
    expect(queryByTestId('hamburger-menu-dropdown')).toBeInTheDocument();
    fireEvent.click(hamburgerIcon);
    expect(queryByTestId('hamburger-menu-dropdown')).toBeInTheDocument();
  });

  it('navigates to profile on dropdown item click', () => {
    const { getByTestId, getByText } = render(
      <Header headerRef={mockHeaderRef} headerHeight={50} />
    );

    fireEvent.click(getByTestId('profile-details').querySelector('svg')!);
    const profileOption = getByText('ProfileDropdown.profile');
    fireEvent.click(profileOption);

    expect(mockNavigate).toHaveBeenCalledWith('profile', {
      state: { from: window.location.pathname },
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
