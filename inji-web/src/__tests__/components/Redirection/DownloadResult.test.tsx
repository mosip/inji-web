import {renderWithProvider} from '../../../test-utils/mockUtils';
import {DownloadResult} from '../../../components/Redirection/DownloadResult';
import {RequestStatus} from '../../../hooks/useFetch';
import {screen} from "@testing-library/react";
import {useUser} from "../../../hooks/User/useUser";

const mockLandingPageWrapper = jest.fn();
jest.mock('../../../components/Common/LandingPageWrapper', () => ({
    LandingPageWrapper: (props: any) => {
        mockLandingPageWrapper(props);
        return <div data-testid="mock-landing-page-wrapper" {...props} />;
    },
}));

jest.mock("../../../hooks/User/useUser.tsx", () => {
    const actualModule = jest.requireActual('../../../hooks/User/useUser');
    return {
        useUser: jest.fn(),
        UserProvider: actualModule.UserProvider,
    };
});

const mockUseUser = useUser as jest.Mock;

describe('Testing of DownloadResult -> ', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseUser.mockReturnValue({isUserLoggedIn: () => false});
    });

    it('matches snapshot when user is not logged in', () => {
        const {asFragment} = renderWithProvider(
            <DownloadResult title="Title" subTitle="SubTitle" state={RequestStatus.DONE}/>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('matches snapshot when user is logged in', () => {
        mockUseUser.mockReturnValue({isUserLoggedIn: () => true});

        const {asFragment} = renderWithProvider(
            <DownloadResult title="Title" subTitle="SubTitle" state={RequestStatus.DONE}/>
        );

        expect(asFragment()).toMatchSnapshot();
    });

    it('renders div wrapper when user is logged in', () => {
        mockUseUser.mockReturnValue({isUserLoggedIn: () => true});

        renderWithProvider(<DownloadResult title="Title" subTitle="SubTitle" state={RequestStatus.DONE}/>);

        expect(screen.getByTestId('download-result-container')).toBeInTheDocument();
        expect(screen.getByTestId('mock-landing-page-wrapper')).toBeInTheDocument();
    });

    it('does not render div wrapper when user is not logged in', () => {
        renderWithProvider(
            <DownloadResult title="Title" subTitle="SubTitle" state={RequestStatus.DONE}/>
        );

        expect(screen.queryByTestId('download-result-container')).not.toBeInTheDocument();
        expect(screen.getByTestId('mock-landing-page-wrapper')).toBeInTheDocument();
    });

    test.each([
        [
            'DONE',
            RequestStatus.DONE,
            {icon: expect.anything(), title: 'Title', subTitle: 'SubTitle', gotoHome: true},
        ],
        [
            'ERROR',
            RequestStatus.ERROR,
            {icon: expect.anything(), title: 'Title', subTitle: 'SubTitle', gotoHome: true},
        ],
        [
            'LOADING',
            RequestStatus.LOADING,
            {icon: expect.anything(), title: 'Title', subTitle: 'SubTitle', gotoHome: false},
        ],
    ])(
        'should call LandingPageWrapper with correct props for state %s',
        (_stateName, state, expectedProps) => {
            renderWithProvider(<DownloadResult title="Title" subTitle="SubTitle" state={state}/>);

            expect(mockLandingPageWrapper).toHaveBeenCalledWith(
                expect.objectContaining(expectedProps)
            );
        }
    );
});