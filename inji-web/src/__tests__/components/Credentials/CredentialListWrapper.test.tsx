import React from 'react';
import {render, screen} from '@testing-library/react';
import {CredentialListWrapper} from '../../../components/Credentials/CredentialListWrapper';
import {RequestStatus} from "../../../utils/constants";

const mockCredentialList = jest.fn();

jest.mock('../../../components/Credentials/CredentialList', () => ({
    CredentialList: (props: any) => {
        mockCredentialList(props);
        return <div data-testid="mock-credential-list"/>;
    },
}));

describe('Testing of CredentialListWrapper -> ', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the container with the correct class name', () => {
        const className = 'test-class';
        render(<CredentialListWrapper state={RequestStatus.DONE} className={className}/>);

        const container = screen.getByTestId('Credential-List-Container');
        expect(container).toBeInTheDocument();
        expect(container).toHaveClass(className);
    });

    it('renders the CredentialList component', () => {
        render(<CredentialListWrapper state={RequestStatus.DONE} className="test-class"/>);

        const credentialList = screen.getByTestId('mock-credential-list');
        expect(credentialList).toBeInTheDocument();
    });

    it('passes the correct state prop to the CredentialList component', () => {
        render(<CredentialListWrapper state={RequestStatus.LOADING} className="test-class"/>);

        expect(mockCredentialList).toHaveBeenCalledWith(
            expect.objectContaining({state: RequestStatus.LOADING}),
        );
    });
});