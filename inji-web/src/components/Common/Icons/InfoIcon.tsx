import React from 'react';
import InfoIconSrc from '../../../assets/InfoIcon.svg';

interface InfoIconProps {
  className?: string;
  testId?: string;
  alt?: string;
}

export const InfoIcon: React.FC<InfoIconProps> = ({
  className = '',
  testId = 'icon-info',
  alt = 'Info'
}) => {
  return (
    <img
      data-testid={testId}
      src={InfoIconSrc}
      alt={alt}
      className={className}
    />
  );
};