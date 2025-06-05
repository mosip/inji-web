import React from "react";
import { InfoFieldProps } from "./types";

export const InfoField: React.FC<InfoFieldProps> = (props) => {
  return (
    <div data-testid="info-field" className="w-[90%]  flex flex-col items-left my-4">
      {/* Label */}
      <h3 data-testid={`label-${props.testId}`} className="text-gray-500 text-sm">{props.label}</h3>

      {/* Value */}
      <p data-testid={`value-${props.testId}`} className="text-black break-all text-base font-semibold">{props.value}</p>

      {/* Horizontal Rule */}
      <hr data-testid={`horizontal-rule-${props.testId}`} className="border-t border-gray-300 w-full my-2" />
    </div>
  );
};

