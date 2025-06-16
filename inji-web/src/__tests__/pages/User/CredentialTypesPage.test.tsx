import { renderWithRouter } from '../../../test-utils/mockUtils';
import { screen, waitFor } from '@testing-library/react';
import { useFetch, RequestStatus } from '../../../hooks/useFetch';
import { setMockUseDispatchReturnValue } from '../../../test-utils/mockReactRedux';
import { CredentialTypesPage } from '../../../pages/User/CredentialTypes/CredentialTypesPage';

jest.mock('../../../hooks/useFetch', () => ({
  useFetch: jest.fn(),
  RequestStatus: {
    LOADING: 0,
    DONE: 1,
    ERROR: 2,
  },
}));

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('../../../components/Common/Buttons/NavBackArrowButton', () => ({
  NavBackArrowButton: (props: { onClick?: () => void }) => (
    <button data-testid="back-button" onClick={props.onClick}>
      Back
    </button>
  ),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  initReactI18next: {
    type: '3rdParty',
    init: () => {},
  },
}));

const mockUseFetch = useFetch as jest.Mock;

describe('CredentialTypesPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setMockUseDispatchReturnValue(jest.fn());
  });

  it('renders CredentialTypesPage component', () => {
    mockUseFetch.mockReturnValue({
      state: RequestStatus.DONE,
      fetchRequest: jest.fn(),
    });

    renderWithRouter(<CredentialTypesPage backUrl="/user/home" />);

    expect(screen.getByTestId('credential-types-page-container')).toBeInTheDocument();
  });

  it('matches snapshot after data loads', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        response: { display: [{ language: 'en', name: 'Issuer1' }] },
      })
      .mockResolvedValueOnce({ response: [] });

    mockUseFetch.mockReturnValue({ state: RequestStatus.DONE, fetchRequest: fetchMock });

    const { asFragment } = renderWithRouter(<CredentialTypesPage />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(screen.getByText('Issuer1')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

});
