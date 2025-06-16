import {screen, fireEvent, cleanup} from '@testing-library/react';
import {LandingPageWrapper} from '../../../components/Common/LandingPageWrapper';
import {mockUseTranslation, renderWithProvider, mockUseNavigate} from '../../../test-utils/mockUtils';
import {mockLandingPageWrapperProps} from '../../../test-utils/mockObjects';
import {useUser} from "../../../hooks/User/useUser";
import {ROUTES} from "../../../utils/constants";

// Mock useTranslation
mockUseTranslation();

//todo : extract the local method to mockUtils, which is added to bypass the routing problems
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../../hooks/User/useUser.tsx", () => {
    const actualModule = jest.requireActual('../../../hooks/User/useUser');
    return {
        useUser: jest.fn(),
        UserProvider: actualModule.UserProvider,
    };
});
const mockUseUser = useUser as jest.Mock;

describe("Testing the Layout of LandingPageWrapper -> ", () => {
    afterEach(() => {
        cleanup();
    });

    test.each([
        ['matches snapshot when user is logged in', true],
        ['matches snapshot when user is not logged in', false],
    ])('%s', (description, isLoggedIn) => {
        mockUseUser.mockReturnValue({isUserLoggedIn: isLoggedIn});

        const {asFragment} = renderWithProvider(<LandingPageWrapper {...mockLandingPageWrapperProps} />);

        expect(asFragment()).toMatchSnapshot();
    });
});

describe("Testing the Functionality of LandingPageWrapper -> ", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseNavigate();
        mockUseUser.mockReturnValue({isUserLoggedIn: true});
    });

    afterEach(() => {
        cleanup();
    });

    test('should render the Title container and Title content always', () => {
        renderWithProvider(<LandingPageWrapper {...mockLandingPageWrapperProps} />);

        expect(screen.getByTestId("title-container-download-result")).toBeInTheDocument();
        expect(screen.getByTestId("title-download-result")).toHaveTextContent("Test Title");
    });

    test.each([
        ['navigates to home when user is logged in', true, ROUTES.USER_HOME],
        ['navigates to root when user is not logged in', false, ROUTES.ROOT],
    ])('should %s', (description, isLoggedIn, expectedRoute) => {
        mockUseUser.mockReturnValue({isUserLoggedIn: isLoggedIn});
        renderWithProvider(<LandingPageWrapper {...mockLandingPageWrapperProps} />);
        const homeButton = screen.getByTestId("btn-home-download-result");

        fireEvent.click(homeButton);

        expect(mockNavigate).toHaveBeenCalledWith(expectedRoute);
        expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    test.each([
        ['renders the subtitle if it is passed in props', mockLandingPageWrapperProps.subTitle, true],
        ['does not render subtitle when it is not passed in props', undefined, false],
        ['does not render subtitle when it is an empty string', "", false],
    ])('should %s', (description, subTitleValue, shouldBePresent) => {
        const props = {...mockLandingPageWrapperProps, subTitle: subTitleValue};
        if (subTitleValue === undefined) {
            delete props.subTitle;
        }

        renderWithProvider(<LandingPageWrapper {...props} />);

        if (shouldBePresent && subTitleValue) {
            expect(screen.getByTestId("subtitle-container-download-result")).toHaveTextContent(subTitleValue);
        } else {
            expect(screen.queryByTestId("subtitle-container-download-result")).not.toBeInTheDocument();
        }
    });

    test.each([
        ['renders the home button if gotoHome prop value is true', true],
        ['does not render the home button if gotoHome prop value is false', false],
    ])(
        '%s',
        (description: string, gotoHomeValue: boolean) => {
            renderWithProvider(<LandingPageWrapper {...mockLandingPageWrapperProps} gotoHome={gotoHomeValue}/>);

            if (gotoHomeValue) {
                expect(screen.getByTestId('btn-home-download-result')).toBeInTheDocument();
            } else {
                expect(screen.queryByTestId('btn-home-download-result')).not.toBeInTheDocument();
            }
        }
    );
});
