import React from 'react';
import { IssuersList } from '../../../components/Issuers/IssuersList';
import { RequestStatus } from '../../../hooks/useFetch';
import { mockIssuerObjectList } from '../../../test-utils/mockObjects';
import { renderWithProvider } from '../../../test-utils/mockUtils';

// Mock the i18n configuration
jest.mock('../../../utils/i18n', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    getObjectForCurrentLanguage: jest.fn((displayArray: any, language: string) => displayArray),
}));

// Mock the useSelector hook
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

describe("Test IssuersList Component", () => {
    beforeEach(() => {
        const useSelectorMock = require('react-redux').useSelector;
        useSelectorMock.mockImplementation((selector: any) => selector({
            issuers: {
                issuers: mockIssuerObjectList,
                filtered_issuers: mockIssuerObjectList,
            },
            common: {
                language: 'en',
            },
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // const renderWithProvider = (state: RequestStatus) => {
    //     return render(
    //         <Provider store={reduxStore}>
    //             <Router>
    //                 <IssuersList state={state} />
    //             </Router>
    //         </Provider>
    //     );
    // };

    test('checks whether it renders loading state', () => {
        
        const { asFragment } = renderWithProvider(<IssuersList state={RequestStatus.LOADING} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('checks whether it renders error state', () => {
        const { asFragment } = renderWithProvider(<IssuersList state={RequestStatus.ERROR}/>);
        expect(asFragment()).toMatchSnapshot();
    });

    test('checks whether it renders empty issuers list', () => {
        const useSelectorMock = require('react-redux').useSelector;
        useSelectorMock.mockImplementation((selector: any) => selector({
            issuers: {
                issuers: [],
                filtered_issuers: [],
            },
            common: {
                language: 'en',
            },
        }));

        const { asFragment } = renderWithProvider(<IssuersList state={RequestStatus.DONE} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('checks whether it renders issuers list properly', () => {
        const { asFragment } = renderWithProvider(<IssuersList state={RequestStatus.DONE} />);
        // expect(screen.getByText('Issuer 1')).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });
});
