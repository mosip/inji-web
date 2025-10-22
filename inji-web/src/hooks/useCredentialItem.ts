import { useState, useCallback } from 'react';

interface UseCredentialItemProps {
    credentialId: string;
    onToggle: (credentialId: string) => void;
}

export const useCredentialItem = ({ credentialId, onToggle }: UseCredentialItemProps) => {
    const [imageError, setImageError] = useState(false);

    const handleToggle = useCallback(() => {
        onToggle(credentialId);
    }, [onToggle, credentialId]);

    const handleImageError = useCallback(() => {
        setImageError(true);
    }, []);

    return {
        imageError,
        handleToggle,
        handleImageError
    };
};
