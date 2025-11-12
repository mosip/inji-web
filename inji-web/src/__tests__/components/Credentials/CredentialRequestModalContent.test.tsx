import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CredentialRequestModalContent } from '../../../components/Credentials/CredentialRequestModalContent';
import { PresentationCredential } from '../../../types/components';

jest.mock('../../../components/Credentials/PresentationCredentialList', () => ({
    PresentationCredentialList: ({ credentials, selectedCredentials, onCredentialToggle }: any) => (
        <div data-testid="presentation-credential-list">
            <div data-testid="credentials-prop">
                {credentials?.map((cred: PresentationCredential) => (
                    <div key={cred.credentialId} data-testid={`cred-${cred.credentialId}`}>
                        {cred.credentialTypeDisplayName}
                    </div>
                ))}
            </div>
            <div data-testid="selected-credentials-prop">
                {selectedCredentials?.join(',')}
            </div>
            <button
                data-testid="test-toggle-button"
                onClick={() => onCredentialToggle('test-credential-id')}
            >
                Toggle Test
            </button>
        </div>
    ),
}));

describe('CredentialRequestModalContent Component', () => {
    const mockCredentials: PresentationCredential[] = [
        {
            credentialId: 'cred-1',
            credentialTypeDisplayName: 'Passport',
            credentialTypeLogo: '/passport.png',
            format: 'ldp_vc'
        },
        {
            credentialId: 'cred-2',
            credentialTypeDisplayName: 'Driver License',
            credentialTypeLogo: '/driver.png',
            format: 'ldp_vc'
        },
    ];

    const mockSelectedCredentials = ['cred-1'];
    const mockOnCredentialToggle = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Rendering', () => {
        it('should match snapshot', () => {
            const { asFragment } = render(
                <CredentialRequestModalContent
                    credentials={mockCredentials}
                    selectedCredentials={mockSelectedCredentials}
                    onCredentialToggle={mockOnCredentialToggle}
                />
            );
            expect(asFragment()).toMatchSnapshot();
        });

        it('should render the container with correct className', () => {
            render(
                <CredentialRequestModalContent
                    credentials={mockCredentials}
                    selectedCredentials={mockSelectedCredentials}
                    onCredentialToggle={mockOnCredentialToggle}
                />
            );

            const container = screen.getByTestId('presentation-credential-list').parentElement;
            expect(container).toBeInTheDocument();
        });

        it('should render PresentationCredentialList component', () => {
            render(
                <CredentialRequestModalContent
                    credentials={mockCredentials}
                    selectedCredentials={mockSelectedCredentials}
                    onCredentialToggle={mockOnCredentialToggle}
                />
            );

            expect(screen.getByTestId('presentation-credential-list')).toBeInTheDocument();
        });
    });

    describe('Props passing', () => {
        it('should pass credentials prop to PresentationCredentialList', () => {
            render(
                <CredentialRequestModalContent
                    credentials={mockCredentials}
                    selectedCredentials={mockSelectedCredentials}
                    onCredentialToggle={mockOnCredentialToggle}
                />
            );

            expect(screen.getByTestId('cred-cred-1')).toBeInTheDocument();
            expect(screen.getByTestId('cred-cred-2')).toBeInTheDocument();
            expect(screen.getByText('Passport')).toBeInTheDocument();
            expect(screen.getByText('Driver License')).toBeInTheDocument();
        });

        it('should pass selectedCredentials prop to PresentationCredentialList', () => {
            render(
                <CredentialRequestModalContent
                    credentials={mockCredentials}
                    selectedCredentials={mockSelectedCredentials}
                    onCredentialToggle={mockOnCredentialToggle}
                />
            );

            const selectedProp = screen.getByTestId('selected-credentials-prop');
            expect(selectedProp).toHaveTextContent('cred-1');
        });

        it('should pass empty selectedCredentials array when not provided', () => {
            render(
                <CredentialRequestModalContent
                    credentials={mockCredentials}
                    selectedCredentials={[]}
                    onCredentialToggle={mockOnCredentialToggle}
                />
            );

            const selectedProp = screen.getByTestId('selected-credentials-prop');
            expect(selectedProp).toHaveTextContent('');
        });

        it('should pass onCredentialToggle callback to PresentationCredentialList', () => {
            render(
                <CredentialRequestModalContent
                    credentials={mockCredentials}
                    selectedCredentials={mockSelectedCredentials}
                    onCredentialToggle={mockOnCredentialToggle}
                />
            );

            const toggleButton = screen.getByTestId('test-toggle-button');
            toggleButton.click();

            expect(mockOnCredentialToggle).toHaveBeenCalledTimes(1);
            expect(mockOnCredentialToggle).toHaveBeenCalledWith('test-credential-id');
        });
    });

    describe('Edge cases', () => {
        it('should handle empty credentials array', () => {
            render(
                <CredentialRequestModalContent
                    credentials={[]}
                    selectedCredentials={[]}
                    onCredentialToggle={mockOnCredentialToggle}
                />
            );

            expect(screen.getByTestId('presentation-credential-list')).toBeInTheDocument();
            expect(screen.queryByTestId('cred-cred-1')).not.toBeInTheDocument();
        });

        it('should handle multiple selected credentials', () => {
            const multipleSelected = ['cred-1', 'cred-2'];
            render(
                <CredentialRequestModalContent
                    credentials={mockCredentials}
                    selectedCredentials={multipleSelected}
                    onCredentialToggle={mockOnCredentialToggle}
                />
            );

            const selectedProp = screen.getByTestId('selected-credentials-prop');
            expect(selectedProp).toHaveTextContent('cred-1,cred-2');
        });
    });
});

