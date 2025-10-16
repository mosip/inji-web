import React, { memo } from 'react';
import { PresentationCredential } from '../../types/components';
import { CredentialRequestModalStyles } from '../../modals/CredentialRequestModalStyles';
import { useCredentialItem } from '../../hooks/useCredentialItem';
import { CredentialFallbackIcon } from './CredentialFallbackIcon';

interface CredentialItemProps {
    credential: PresentationCredential;
    isSelected: boolean;
    onToggle: (credentialId: string) => void;
}

const CredentialItemComponent: React.FC<CredentialItemProps> = ({
    credential,
    isSelected,
    onToggle
}) => {
    const { imageError, handleToggle, handleImageError } = useCredentialItem({
        credentialId: credential.credentialId,
        onToggle
    });

    const credentialName = credential.credentialTypeDisplayName;

    return (
        <li
            data-testid={`item-${credentialName.toLowerCase().replace(/\s+/g, '-')}`}
            className={`${CredentialRequestModalStyles.content.credentialItemWrapper} shadow-md ${
                isSelected ? 'bg-gradient-to-r from-orange-500 via-red-500 to-purple-600' : ''
            }`}
            style={{
                padding: isSelected ? '1px' : '0px',
                borderRadius: '8px'
            }}
            role="listitem"
            aria-label={`Credential: ${credentialName}`}
        >
            <div
                className={`${CredentialRequestModalStyles.content.credentialItem} ${
                    isSelected ? 'bg-orange-50' : ''
                }`}
                style={{
                    background: isSelected ? '#FFFFFF' : undefined,
                    borderRadius: '8px'
                }}
            >
                <div className={CredentialRequestModalStyles.content.credentialContent}>
                    {/* Credential Logo */}
                    <div 
                        data-testid={`icon-${credentialName.toLowerCase().replace(/\s+/g, '-')}`}
                        className={CredentialRequestModalStyles.content.credentialImage}
                        role="img"
                        aria-label={`${credentialName} logo`}
                        style={{
                            backgroundColor: imageError ? '#6B7280' : undefined
                        }}
                    >
                        {imageError ? (
                            <CredentialFallbackIcon />
                        ) : (
                            <img
                                src={credential.credentialTypeLogo}
                                alt={credentialName}
                                className="w-full h-full object-cover rounded-full"
                                onError={handleImageError}
                            />
                        )}
                    </div>

                    {/* Credential Name */}
                    <div className={CredentialRequestModalStyles.content.credentialInfo}>
                        <span className={CredentialRequestModalStyles.content.credentialName}>
                            {credentialName}
                        </span>
                    </div>
                </div>

                {/* Checkbox */}
                <div className={CredentialRequestModalStyles.content.checkboxContainer}>
                    <input
                        data-testid={`checkbox-${credentialName.toLowerCase().replace(/\s+/g, '-')}`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={handleToggle}
                        className={`${CredentialRequestModalStyles.content.checkbox} ${
                            isSelected ? 'bg-gradient-to-r from-orange-500 via-red-500 to-purple-600' : ''
                        }`}
                        style={{
                            appearance: 'none',
                            border: isSelected ? 'none' : '1px solid #d1d5db',
                            backgroundColor: isSelected ? 'transparent' : '#f9fafb',
                            position: 'relative'
                        }}
                        aria-label={`Select ${credentialName} credential`}
                        aria-describedby={`credential-${credential.credentialId}-description`}
                    />
                    {isSelected && (
                        <div
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none w-5 h-5"
                            aria-hidden="true"
                        >
                            <svg
                                className={CredentialRequestModalStyles.content.checkboxIcon}
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <path
                                    d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                                    fill="white"
                                />
                            </svg>
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};

export const CredentialItem = memo(CredentialItemComponent);
