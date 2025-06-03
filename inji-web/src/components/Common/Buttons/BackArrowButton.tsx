import React from 'react';
import BackArrowIcon from '../../../assets/BackArrowIcon.svg';

interface BackArrowButtonProps {
  onClick: () => void;
  className?: string;
  testId?: string;
  alt?: string;
}

export const BackArrowButton: React.FC<BackArrowButtonProps> = ({
  onClick,
  className = '',
  testId = 'btn-back-arrow',
  alt = 'Back Arrow'
}) => {
  return (
    <img
      data-testid={testId}
      src={BackArrowIcon}
      alt={alt}
      className={`cursor-pointer ${className}`}
      onClick={onClick}
    />
  );
};