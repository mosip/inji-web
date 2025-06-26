import React from 'react';
import {RedirectionPage} from '../../pages/RedirectionPage';
import {getActiveSession} from '../../utils/sessions';
import {getErrorObject} from '../../utils/misc';
import {mockusei18n, renderWithRouter} from '../../test-utils/mockUtils';
import {mockApiResponse, mockUseApi} from "../../test-utils/setupUseApiMock";
import {RequestStatus} from "../../utils/constants";
import {api, ContentTypes} from "../../utils/api";

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
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

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
});
