import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {ProfilePage} from '../../../pages/User/Profile/ProfilePage';
import {MemoryRouter, useLocation} from 'react-router-dom';
import {navigateToUserHome} from "../../../utils/navigationUtils";
import {mockApiResponse, mockUseApi} from "../../../test-utils/setupUseApiMock";
import {RequestStatus} from '../../../utils/constants';

// Mocks
jest.mock('../../../utils/navigationUtils.ts', () => ({
  navigateToUserHome: jest.fn(),
}));
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
jest.mock('../../../components/Common/Buttons/NavBackArrowButton.tsx', () => ({
  NavBackArrowButton: ({ onBackClick }: { onBackClick: () => void }) => (
    <button onClick={onBackClick}>Back</button>
  ),
}));
jest.mock('../../../components/Common/Buttons/TertiaryButton.tsx', () => ({
  TertiaryButton: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick}>Go Home</button>
  ),
}));
jest.mock('../../../components/Common/InfoField.tsx', () => ({
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

jest.mock("../../../hooks/useApi.ts", () => ({
    useApi: () => mockUseApi,
}))

const mockedUseLocation = useLocation as jest.Mock;

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={['/profile']}>
      <ProfilePage />
    </MemoryRouter>
  );

describe('ProfilePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockApiResponse({
      response: ({
        profilePictureUrl: 'https://example.com/photo.jpg',
        displayName: 'John Doe',
        email: 'john@example.com',
        walletId: '12345',
      })
    })
  });

  it('renders loading skeletons when loading', () => {
    mockedUseLocation.mockReturnValue({ state: { from: '/user' } });

    renderWithRouter();

    expect(screen.getByTestId('profile-page')).toBeInTheDocument();
    expect(screen.getByTestId('profile-page-horizontal-rule')).toBeInTheDocument();
    expect(screen.queryAllByRole('presentation')).toHaveLength(0);
  });

  it('renders user data when loaded', async () => {
    mockedUseLocation.mockReturnValue({});
    mockUseApi.state = RequestStatus.DONE;
    mockUseApi.data = {
      profilePictureUrl: 'https://example.com/photo.jpg',
      displayName: 'John Doe',
      email: 'john@example.com',
      walletId: '12345',
    }

    renderWithRouter();

    await screen.findByTestId('profile-page-picture');
    expect(screen.getByText('ProfilePage.fullName')).toBeInTheDocument();
    expect(screen.getByText('ProfilePage.emailAddress')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls back click with location.state.from', () => {
    mockedUseLocation.mockReturnValue({ state: { from: '/user' } });

    renderWithRouter();
    fireEvent.click(screen.getByText('Back'));

    expect(mockedNavigate).toHaveBeenCalledWith('/user');
  });

  it('navigates to home if no location.state.from', () => {
    mockedUseLocation.mockReturnValue({});

    renderWithRouter();
    fireEvent.click(screen.getByText('Back'));

    expect(navigateToUserHome).toHaveBeenCalledWith(mockedNavigate);
  });

  it('navigates to home on Go Home button click', () => {
    mockedUseLocation.mockReturnValue({});

    renderWithRouter();
    fireEvent.click(screen.getByText('Go Home'));

    expect(navigateToUserHome).toHaveBeenCalledWith(mockedNavigate);
  });
});
