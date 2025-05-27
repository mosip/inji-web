import React from "react";
import { InfoFieldProps } from "../../components/Dashboard/types";

export const InfoField: React.FC<InfoFieldProps> = (props) => {
  return (
    <div className="w-[90%]  flex flex-col items-left my-4">
      {/* Field Name */}
      <h3 className="text-gray-500 text-sm">{props.FieldName}</h3>

      {/* Value */}
      <p className="text-black break-all text-base font-semibold">{props.Value}</p>

      {/* Horizontal Rule */}
      <hr className="border-t border-gray-300 w-full my-2" />
    </div>
  );
};

