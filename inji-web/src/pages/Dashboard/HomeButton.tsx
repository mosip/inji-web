import React from "react";
import { HomeButtonProps } from "../../components/Dashboard/types";

export const HomeButton: React.FC<HomeButtonProps> = ({
  title,
  onClick,
  testId,
}) => (
  <button
    data-testid={testId}
    className="text-xs sm:text-sm text-[#5B03AD] cursor-pointer hover:underline"
    onClick={onClick}
  >
    {title}
  </button>
);
