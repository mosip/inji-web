import { render, screen, waitFor } from '@testing-library/react';
import { useFetch, RequestStatus } from '../../../hooks/useFetch';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CredentialTypesPage } from '../../../pages/Dashboard/CredentialTypesPage';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../hooks/useFetch', () => ({
  useFetch: jest.fn(),
  RequestStatus: {
    LOADING: 0,
    DONE: 1,
    ERROR: 2,
  },
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../../../pages/Dashboard/NavBackArrowButton', () => ({
  NavBackArrowButton: (props: { onClick?: () => void }) => (
    <button data-testid="back-button" onClick={props.onClick}>
      Back
    </button>
  ),
}));

const mockUseSelector = useSelector as jest.MockedFunction<typeof useSelector>;
const mockUseDispatch = useDispatch as jest.MockedFunction<typeof useDispatch>;
const mockUseFetch = useFetch as jest.Mock;

mockUseSelector.mockImplementation((selectorFn) =>
  selectorFn({
    language: 'en',
    issuers: {
      selectedIssuer: {
        display: { name: 'Test Issuer' },
      },
    },
  })
);

describe('CredentialTypesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDispatch.mockReturnValue(jest.fn());
  });

  it('renders CredentialTypesPage component', () => {
    mockUseFetch.mockReturnValue({
      state: RequestStatus.DONE,
      fetchRequest: jest.fn(),
    });

    render(
      <MemoryRouter>
        <CredentialTypesPage backUrl="/dashboard" />
      </MemoryRouter>
    );

    expect(screen.getByTestId('credential-types-page-container')).toBeInTheDocument();
  });

  it('displays error toast when fetch fails', async () => {
    mockUseFetch.mockReturnValue({
      state: RequestStatus.ERROR,
      fetchRequest: jest.fn(),
    });

    render(
      <MemoryRouter>
        <CredentialTypesPage backUrl="/dashboard" />
      </MemoryRouter>
    );

    await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('The service is currently unavailable now. Please try again later.');
    });
  });

  it('renders CredentialList component', () => {
    mockUseFetch.mockReturnValue({
      state: RequestStatus.DONE,
      fetchRequest: jest.fn(),
    });

    render(
      <MemoryRouter>
        <CredentialTypesPage backUrl="/dashboard" />
      </MemoryRouter>
    );

    expect(screen.getByTestId('credential-list-container')).toBeInTheDocument();
  });
});
