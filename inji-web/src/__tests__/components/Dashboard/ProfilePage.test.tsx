import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfilePage } from '../../../pages/Dashboard/ProfilePage';
import { useUser } from '../../../hooks/useUser';
import { navigateToDashboardHome } from '../../../pages/Dashboard/utils';
import { MemoryRouter } from 'react-router-dom';

// Mocks
jest.mock('../../../hooks/useUser');
jest.mock('../../../pages/Dashboard/utils', () => ({
  navigateToDashboardHome: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
jest.mock('../../../pages/Dashboard/NavBackArrowButton', () => ({
  NavBackArrowButton: ({ onBackClick }: { onBackClick: () => void }) => (
    <button onClick={onBackClick}>Back</button>
  ),
}));
jest.mock('../../../pages/Dashboard/TeritaryButton', () => ({
  TeritaryButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Go Home</button>
  ),
}));
jest.mock('../../../components/Dashboard/InfoField', () => ({
  InfoField: ({ label, value }: { label: string; value: string }) => (
    <div role="presentation">
      <span>{label}</span>:<span>{value}</span>
    </div>
  ),
}));

// Fully mock useNavigate and useLocation
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockedNavigate,
    useLocation: jest.fn(),
  };
});

import { useLocation } from 'react-router-dom';
const mockedUseLocation = useLocation as jest.Mock;

const mockedUseUser = useUser as jest.Mock;

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={['/profile']}>
      <ProfilePage />
    </MemoryRouter>
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ProfilePage', () => {
  it('renders loading skeletons when loading', () => {
    mockedUseUser.mockReturnValue({
      user: null,
      isLoading: true,
    });
    mockedUseLocation.mockReturnValue({ state: { from: '/dashboard' } });

    renderWithRouter();

    expect(screen.getByTestId('Profile-Page')).toBeInTheDocument();
    expect(screen.getByTestId('profile-page-horizontal-rule')).toBeInTheDocument();
    expect(screen.queryAllByRole('presentation')).toHaveLength(0);
  });

  it('renders user data when loaded', () => {
    mockedUseUser.mockReturnValue({
      user: {
        profilePictureUrl: 'http://example.com/photo.jpg',
        displayName: 'John Doe',
        email: 'john@example.com',
      },
      isLoading: false,
    });
    mockedUseLocation.mockReturnValue({});

    renderWithRouter();

    expect(screen.getByTestId('profile-page-picture')).toBeInTheDocument();
    expect(screen.getByText('ProfilePage.fullName')).toBeInTheDocument();
    expect(screen.getByText('ProfilePage.emailAddress')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls back click with location.state.from', () => {
    mockedUseUser.mockReturnValue({
      user: null,
      isLoading: true,
    });
    mockedUseLocation.mockReturnValue({ state: { from: '/dashboard' } });

    renderWithRouter();
    fireEvent.click(screen.getByText('Back'));

    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to home if no location.state.from', () => {
    mockedUseUser.mockReturnValue({
      user: null,
      isLoading: true,
    });
    mockedUseLocation.mockReturnValue({});

    renderWithRouter();
    fireEvent.click(screen.getByText('Back'));

    expect(navigateToDashboardHome).toHaveBeenCalledWith(mockedNavigate);
  });

  it('navigates to home on Go Home button click', () => {
    mockedUseUser.mockReturnValue({
      user: null,
      isLoading: true,
    });
    mockedUseLocation.mockReturnValue({});

    renderWithRouter();
    fireEvent.click(screen.getByText('Go Home'));

    expect(navigateToDashboardHome).toHaveBeenCalledWith(mockedNavigate);
  });
});
