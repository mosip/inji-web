import React from 'react';
import CrossIcon from '../../../assets/CrossIcon.svg';

interface CrossIconButtonProps {
  onClick: () => void;
  btnClassName?: string;
  iconClassName?: string;
  btnTestId: string;
  iconTestId: string;
}

export const CrossIconButton: React.FC<CrossIconButtonProps> = ({
  onClick,
  btnClassName = "",
  iconClassName= "",
  btnTestId = "btn-close-icon-container",
  iconTestId = "icon-close",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={btnTestId}
      className={btnClassName}
    >
      <img
        src={CrossIcon}
        alt="Close"
        data-testid={iconTestId}
        className={iconClassName}
      />
    </button>
  );
};