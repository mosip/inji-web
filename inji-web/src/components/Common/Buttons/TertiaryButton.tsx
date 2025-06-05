import React from "react";

type TertiaryButtonProps ={
  onClick: () => void;
  title:string,
  testId:string
}

export const TertiaryButton: React.FC<TertiaryButtonProps> = ({
  title,
  onClick,
  testId,
}) => (
  <button
    data-testid={`btn-${testId}`}
    className="text-xs sm:text-sm text-iw-secondary cursor-pointer hover:underline"
    onClick={onClick}
  >
    {title}
  </button>
);
