import {screen, waitFor} from '@testing-library/react';
import {setMockUseDispatchReturnValue} from '../../../test-utils/mockReactRedux';
import {CredentialTypesPage} from '../../../pages/User/CredentialTypes/CredentialTypesPage';
import {mockApiResponseSequence, mockUseApi} from "../../../test-utils/setupUseApiMock";
import {renderWithRouter} from "../../../test-utils/mockUtils";
import {credentialWellknown} from "../../../test-utils/mockObjects";

jest.mock('../../../hooks/useApi.ts', () => ({
    useApi: () => mockUseApi
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
    beforeEach(() => {
        jest.clearAllMocks();
        setMockUseDispatchReturnValue(jest.fn());
        mockApiResponseSequence([
            {response: {response: {display: [{language: 'en', name: 'Issuer1'}]}}},
            {response: credentialWellknown}
        ])
    });

    it('renders CredentialTypesPage component', () => {
        const {asFragment} = renderWithRouter(<CredentialTypesPage backUrl="/user/home"/>);

        expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot after data loads', async () => {
        renderWithRouter(<CredentialTypesPage/>);

        await waitFor(() => expect(mockUseApi.fetchData).toHaveBeenCalledTimes(2));

        expect(screen.getByTestId('credential-types-page-container')).toBeInTheDocument();
        await screen.findByText('Issuer1')
    });
});
