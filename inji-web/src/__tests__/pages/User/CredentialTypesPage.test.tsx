import {renderWithRouter} from '../../../test-utils/mockUtils';
import {screen, waitFor} from '@testing-library/react';
import {RequestStatus} from '../../../hooks/useFetch';
import {setMockUseDispatchReturnValue} from '../../../test-utils/mockReactRedux';
import {CredentialTypesPage} from '../../../pages/User/CredentialTypes/CredentialTypesPage';
import {useApi} from "../../../hooks/useApi";

jest.mock('../../../hooks/useApi.ts', () => ({
    useApi: jest.fn(),
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
    useTranslation: () => ({t: (key: string) => key}),
    initReactI18next: {
        type: '3rdParty',
        init: () => {
        },
    },
}));


describe('CredentialTypesPage', () => {
    const mockUseApi = useApi as jest.Mock;
    const fetchDataMock = jest
        .fn()
        .mockResolvedValueOnce({
            data: {response: {display: [{language: 'en', name: 'Issuer1'}]}},
            status: 200,
            headers: {},
            state: RequestStatus.DONE,
            error: null
        })
        .mockResolvedValueOnce({
            data: {response: []},
            status: 200,
            headers: {},
            state: RequestStatus.DONE,
            error: null
        });
    beforeEach(() => {
        jest.clearAllMocks();
        setMockUseDispatchReturnValue(jest.fn());
        mockUseApi.mockReturnValue({state: RequestStatus.DONE, fetchData: fetchDataMock});
    });

    it('renders CredentialTypesPage component', () => {
        mockUseApi.mockReturnValue({
            state: RequestStatus.DONE,
            fetchData: jest.fn(),
        });

        renderWithRouter(<CredentialTypesPage backUrl="/user/home"/>);

        expect(screen.getByTestId('credential-types-page-container')).toBeInTheDocument();
    });

    it('matches snapshot after data loads', async () => {
        const {asFragment} = renderWithRouter(<CredentialTypesPage/>);

        await waitFor(() => expect(fetchDataMock).toHaveBeenCalledTimes(2));
        expect(screen.getByText('Issuer1')).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });

});
