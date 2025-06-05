import React from "react";
import { TeritaryButtonProps } from "../../Dashboard/types";

export const TertiaryButton: React.FC<TeritaryButtonProps> = ({
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
