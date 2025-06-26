import React from 'react';
import {RedirectionPage} from '../../pages/RedirectionPage';
import {getActiveSession} from '../../utils/sessions';
import {getErrorObject} from '../../utils/misc';
import {mockusei18n, renderWithProvider, renderWithRouter} from '../../test-utils/mockUtils';
import {mockApiResponse, mockUseApi} from "../../test-utils/setupUseApiMock";
import {RequestStatus} from "../../utils/constants";

//todo : extract the local method to mockUtils, which is added to bypass the routing problems
// Mock the utility functions
jest.mock('../../utils/sessions', () => ({
    getActiveSession: jest.fn(),
    removeActiveSession: jest.fn(),
}));
jest.mock('../../utils/misc', () => ({
    downloadCredentialPDF: jest.fn(),
    getErrorObject: jest.fn(),
    getTokenRequestBody: jest.fn(),
}));

jest.mock('../../hooks/useApi.ts', () => ({
    useApi: () => mockUseApi
}))

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useSearchParams: jest.fn(() => [new URLSearchParams('state=sessionId1'), jest.fn()]),
}));

describe('Testing the Layout of RedirectionPage', () => {
    mockusei18n();
    test('Check if the layout is matching with the snapshots', () => {
        (getActiveSession as jest.Mock).mockReturnValue({
            selectedIssuer: {
                issuer_id: 'issuer1',
                display: [{name: 'Test Issuer'}]
            }
        });
        mockApiResponse({})
        jest.spyOn(require('react-router-dom'), 'useSearchParams').mockReturnValue([new URLSearchParams('state=sessionId1'), jest.fn()]);

        const {asFragment} = renderWithRouter(<RedirectionPage/>);

        expect(asFragment()).toMatchSnapshot();
    });
});

describe('Testing the Functionality of RedirectionPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        mockusei18n();
        (getActiveSession as jest.Mock).mockReturnValue({
            selectedIssuer: {
                issuer_id: 'issuer1',
                display: [{name: 'Test Issuer'}]
            }
        });
        mockApiResponse()
        jest.spyOn(require('react-router-dom'), 'useSearchParams').mockReturnValue([new URLSearchParams('state=sessionId1'), jest.fn()]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("check if getSession is called with the sessionId from url search params state", () => {
        renderWithProvider(<RedirectionPage/>)

        expect(getActiveSession).toHaveBeenCalledWith('sessionId1');
    })

    test('Check if NavBar component is rendered', () => {
        const {asFragment} = renderWithRouter(<RedirectionPage/>);

        expect(asFragment()).toMatchSnapshot();
    });

    test('Check if it displays error message if state is ERROR', async () => {
        (getErrorObject as jest.Mock).mockReturnValue({code: 'error.generic.title', message: 'error.generic.subTitle'});
        mockApiResponse({error: true, state: RequestStatus.ERROR, status: 500})

        const {asFragment} = renderWithRouter(<RedirectionPage/>);

        expect(asFragment()).toMatchSnapshot();
    });

    test('Check if DownloadResult component shows loading state', () => {
        const {asFragment} = renderWithRouter(<RedirectionPage/>);

        expect(asFragment()).toMatchSnapshot();
    });

    test('Check if DownloadResult component shows success state', async () => {
        const {asFragment} = renderWithRouter(<RedirectionPage/>);

        expect(asFragment()).toMatchSnapshot();
    });

    test.todo("check if credential download API with right params is called for logged in user")
    test.todo("check if redirects to stored cards page after successful download for logged in user")
    test.todo("check if credential download API with right params is called for guest mode")
    test.todo("check is success download state is shown after successful download for guest mode")
});
