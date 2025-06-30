import {screen, waitFor} from '@testing-library/react';
import {setMockUseDispatchReturnValue} from '../../../test-utils/mockReactRedux';
import {CredentialTypesPage} from '../../../pages/User/CredentialTypes/CredentialTypesPage';
import {mockApiResponseSequence, mockUseApi} from "../../../test-utils/setupUseApiMock";
import {renderWithRouter} from "../../../test-utils/mockUtils";
import {credentialWellknown, userProfile} from "../../../test-utils/mockObjects";
import {api} from "../../../utils/api";

const mockFetchUserProfile = jest.fn();
const mockIsUserLoggedIn = jest.fn();
let mockUseUserError: Error | null = null;

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

jest.mock('../../../hooks/User/useUser', () => ({
    useUser: () => ({
        fetchUserProfile: mockFetchUserProfile,
        isUserLoggedIn: mockIsUserLoggedIn,
        error: mockUseUserError
    })
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

        mockFetchUserProfile.mockResolvedValue(userProfile)
    });

    it('renders CredentialTypesPage component', () => {
        const {asFragment} = renderWithRouter(<CredentialTypesPage backUrl="/user/home"/>);

        expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot after data loads', async () => {
        renderWithRouter(<CredentialTypesPage/>);

        await waitFor(() => expect(mockUseApi.fetchData).toHaveBeenCalledTimes(2));
        expect(mockUseApi.fetchData).toHaveBeenCalledWith({
            apiConfig: api.fetchSpecificIssuer,
            url: expect.stringContaining("/issuers")
        })
        expect(mockUseApi.fetchData).toHaveBeenCalledWith({
            apiConfig: api.fetchIssuersConfiguration,
            url: expect.stringContaining("/configuration")
        })
        expect(screen.getByTestId('credential-types-page-container')).toBeInTheDocument();
        await screen.findByText('Issuer1')
    });

    it('should show error when fetchUserProfile fails', async () => {
        mockFetchUserProfile.mockRejectedValue(new Error('Error fetching user profile'));
        mockUseUserError = new Error("Error fetching user profile");


        renderWithRouter(<CredentialTypesPage/>);

        await waitFor(() => {
            expect(screen.getByTestId("EmptyList-Outer-Container")).toBeInTheDocument()
        });
    });

    it.todo('should show error when fetching issuer fails');

    it.todo('should show error when fetching issuer configuration fails');

    it.todo('should navigate to credentials page when download status is DONE');

    it.todo('cleans up download session IDs on unmount');

    it.todo('should navigate to backUrl when provided and back button is clicked');

    it.todo('should navigate to previous path when available and back button is clicked')
});
