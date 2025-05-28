import React from "react";
import { InfoFieldProps } from "./types";

export const InfoField: React.FC<InfoFieldProps> = (props) => {
  return (
    <div data-testid="Info-Field" className="w-[90%]  flex flex-col items-left my-4">
      {/* Label */}
      <h3 data-testid="Info-Field-Label" className="text-gray-500 text-sm">{props.label}</h3>

      {/* Value */}
      <p data-testid="Info-Field-Value" className="text-black break-all text-base font-semibold">{props.value}</p>

      {/* Horizontal Rule */}
      <hr data-testid="Info-Field-Horizontal-Rule" className="border-t border-gray-300 w-full my-2" />
    </div>
  );
};

