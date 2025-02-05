import React from 'react';
import { IssuersList } from '../../../components/Issuers/IssuersList';
import { RequestStatus } from '../../../hooks/useFetch';
import { mockIssuerObjectList } from '../../../test-utils/mockObjects';
import { renderWithProvider,mockUseSelector,mockUseTranslation, mockCrypto } from '../../../test-utils/mockUtils';

mockUseTranslation();
mockUseSelector();
global.crypto = mockCrypto;

describe("Testing the Layout of IssuersList", () => {
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

    test('Check whether it renders loading state', () => {
        
        const { asFragment } = renderWithProvider(<IssuersList state={RequestStatus.LOADING} />);
        expect(asFragment()).toMatchSnapshot();
    });

    test('Check whether it renders error state', () => {
        const { asFragment } = renderWithProvider(<IssuersList state={RequestStatus.ERROR}/>);
        expect(asFragment()).toMatchSnapshot();
    });

    test('Check whether it renders empty issuers list', () => {
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

    test('Check whether it renders issuers list properly', () => {
        const { asFragment } = renderWithProvider(<IssuersList state={RequestStatus.DONE} />);
        // expect(screen.getByText('Issuer 1')).toBeInTheDocument();
        expect(asFragment()).toMatchSnapshot();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
});
